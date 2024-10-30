package logger

import (
	"fmt"
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

func Debugf(format string, args ...interface{}) {
	Zlog.Debugf(format, args...)
}

func Infof(format string, args ...interface{}) {
	Zlog.Infof(format, args...)
}

func Warnf(format string, args ...interface{}) {
	Zlog.Warnf(format, args...)
}

func RErrorf(format string, args ...interface{}) error {
	Zlog.Errorf(format, args...)
	return fmt.Errorf(format, args...)
}

func Errorf(format string, args ...interface{}) {
	Zlog.Errorf(format, args...)
}

func Fatalf(format string, args ...interface{}) {
	Zlog.Fatalf(format, args...)
}

// @author: LoanTT
// @function: Debugf
// @description: Debugf
// @param: format string
// @param: args ...interface{}
func (zl *ZapLog) Debugf(format string, args ...interface{}) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= DebugLevel {
		sugar.Debugf(format, args...)
	}
}

// @author: LoanTT
// @function: Infof
// @description: Infof
// @param: format string
// @param: args ...interface{}
func (zl *ZapLog) Infof(format string, args ...interface{}) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= InfoLevel {
		sugar.Infof(format, args...)
	}
}

// @author: LoanTT
// @function: Warnf
// @description: Warnf
// @param: format string
// @param: args ...interface{}
func (zl *ZapLog) Warnf(format string, args ...interface{}) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= WarnLevel {
		sugar.Warnf(format, args...)
	}
}

// @author: LoanTT
// @function: Errorf
// @description: Errorf
// @param: format string
// @param: args ...interface{}
func (zl *ZapLog) Errorf(format string, args ...interface{}) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= ErrorLevel {
		sugar.Errorf(format, args...)
	}
}

// @author: LoanTT
// @function: FErrorf
// @description: FErrorf
// @param: format string
// @param: args ...interface{}
func (zl *ZapLog) Fatalf(format string, args ...interface{}) {
	sugar := Zlog.ConsoleLogger.Sugar()
	if zl.Level <= ErrorLevel {
		sugar.Fatalf(format, args...)
	}
}
