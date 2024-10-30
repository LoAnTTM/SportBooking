package logger

import (
	"fmt"
	"os"
	"slices"

	"spb/bsa/pkg/config"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"gopkg.in/natefinch/lumberjack.v2"
)

type OutputTypes struct {
	Console bool
	File    bool
}

const (
	DebugLevel = iota
	InfoLevel
	WarnLevel
	ErrorLevel
	FatalLevel
)

type ZapLog struct {
	ConsoleLogger *zap.Logger
	Output        OutputTypes
	Filename      *string
	Level         int
}

var Zlog = &ZapLog{}

var logFile = &lumberjack.Logger{
	MaxSize:    10,
	MaxBackups: 10,
	MaxAge:     28,
	Compress:   true,
}

// @author: LoanTT
// @function: NewZlog
// @description: Create a new Zap logger
// @param: config *config.Config
func NewZlog(configVal *config.Config) {
	Zlog.Output = OutputTypes{
		File:    slices.Contains(configVal.Logging.Output, "file"),
		Console: slices.Contains(configVal.Logging.Output, "console"),
	}
	Zlog.Level = configVal.Logging.Level
	Zlog.Filename = &configVal.Logging.Filename
	Zlog.setLevel(configVal.Logging.Level)
	logFile.Filename = fmt.Sprintf("./log/%s", *Zlog.Filename)

	Zlog.ConsoleLogger = newConsoleLogger()
}

func (zl *ZapLog) getField(key string, value interface{}) zap.Field {
	return zap.Any(key, value)
}

func GetField(key string, value interface{}) zap.Field {
	return Zlog.getField(key, value)
}

func (zl *ZapLog) setLevel(level int) *ZapLog {
	zl.Level = level
	return zl
}

func SetLevel(level int) *ZapLog {
	return Zlog.setLevel(level)
}

func (zl *ZapLog) SetFilename(filename string) {
	*zl.Filename = filename
}

func (zl *ZapLog) sysLog(msg string, keysAndValues ...zapcore.Field) {
	if !Zlog.Output.Console && !Zlog.Output.File {
		return
	}

	logger, err := createLogger(zl.Output)
	if err != nil {
		fmt.Printf("failed to initialize logger: %v\n", err)
		return
	}
	defer func() {
		err := logger.Sync()
		if err != nil {
			fmt.Println(err)
			return
		}
	}()

	switch zl.Level {
	case FatalLevel:
		logger.Fatal(msg, keysAndValues...)
	case ErrorLevel:
		logger.Error(msg, keysAndValues...)
	case WarnLevel:
		logger.Warn(msg, keysAndValues...)
	case InfoLevel:
		logger.Info(msg, keysAndValues...)
	default:
		logger.Debug(msg, keysAndValues...)
	}
}

// @author: LoanTT
// @function: sysLog
// @description: SysLog
// @param: msg string
// @param: keysandvalues ...zap.Field
func SysLog(msg string, keysandvalues ...zapcore.Field) {
	Zlog.sysLog(msg, keysandvalues...)
}

// @author: LoanTT
// @function: createLogger
// @description: Create a new logger
// @param: outputTypes OutputTypes
// @return: *zap.Logger, error
func createLogger(outputTypes OutputTypes) (*zap.Logger, error) {
	configVal := zap.NewProductionEncoderConfig()
	configVal.EncodeTime = zapcore.RFC3339TimeEncoder
	// Create file and console encoders
	fileEncoder := zapcore.NewJSONEncoder(configVal)
	consoleEncoder := zapcore.NewConsoleEncoder(configVal)
	// Create writers for file and console
	fileWriter := zapcore.AddSync(logFile)
	consoleWriter := zapcore.AddSync(os.Stdout)
	// Set the log level
	defaultLogLevel := zapcore.DebugLevel
	// Create cores
	fileCore := zapcore.NewCore(fileEncoder, fileWriter, defaultLogLevel)
	consoleCore := zapcore.NewCore(consoleEncoder, consoleWriter, defaultLogLevel)
	// Combine cores
	var core zapcore.Core
	switch {
	case outputTypes.Console && outputTypes.File:
		core = zapcore.NewTee(fileCore, consoleCore)
	case outputTypes.Console:
		core = zapcore.NewTee(consoleCore)
	case outputTypes.File:
		core = zapcore.NewTee(fileCore)
	}

	logger := zap.New(core, zap.AddCaller(), zap.AddCallerSkip(2))
	return logger, nil
}
