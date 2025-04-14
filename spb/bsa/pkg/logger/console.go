package logger

import (
	"os"

	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// @author: LoanTT
// @function: newConsoleLogger
// @description: newConsoleLogger
// @return: *zap.Logger
func newConsoleLogger() *zap.Logger {
	config := zap.NewProductionEncoderConfig()
	config.TimeKey = zapcore.OmitKey
	consoleEncoder := zapcore.NewConsoleEncoder(config)
	consoleWriter := zapcore.AddSync(os.Stdout)
	consoleCore := zapcore.NewCore(consoleEncoder, consoleWriter, zapcore.DebugLevel)
	core := zapcore.NewTee(consoleCore)
	return zap.New(core, zap.AddCaller(), zap.AddCallerSkip(2))
}

func Debugf(format string) {
	Zlog.Debugf(format)
}

func Infof(format string) {
	Zlog.Infof(format)
}

func Warnf(format string) {
	Zlog.Warnf(format)
}

func Errorf(err error) {
	Zlog.Errorf(err)
}

// @author: LoanTT
// @function: Debugf
// @description: Debugf
// @param: message string
func (zl *ZapLog) Debugf(message string) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= DebugLevel {
		sugar.Debugf("- %s", message)
	}
}

// @author: LoanTT
// @function: Infof
// @description: Infof
// @param: message string
func (zl *ZapLog) Infof(message string) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= InfoLevel {
		sugar.Infof("- %s", message)
	}
}

// @author: LoanTT
// @function: Warnf
// @description: Warnf
// @param: message string
func (zl *ZapLog) Warnf(message string) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= WarnLevel {
		sugar.Warnf("- %s", message)
	}
}

// @author: LoanTT
// @function: Errorf
// @description: Errorf
// @param: err error
func (zl *ZapLog) Errorf(err error) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= ErrorLevel {
		sugar.Errorf("- %+v", err)
	}
}
