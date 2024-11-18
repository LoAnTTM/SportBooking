package notification

import (
	"context"
	"encoding/json"
	"fmt"

	"spb/bsa/pkg/config"
	"spb/bsa/pkg/entities/enum"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/queue"
)

type NotificationEntry struct {
	ID       string        `json:"id,omitempty"`
	Status   string        `json:"status"`
	Type     string        `json:"type"`
	Platform enum.Platform `json:"platform"`
	Title    string        `json:"title"`
	Message  string        `json:"message"`
	Error    string        `json:"error"`
}

type ResponsePush struct {
	Logs []NotificationEntry `json:"logs"`
}

type PushNotification struct {
	ID       string        `json:"id"`
	Platform enum.Platform `json:"platform"`
	Message  string        `json:"message"`
	Retry    int           `json:"retry"`
	Error    string        `json:"error,omitempty"`
	Charset  string        `json:"charset,omitempty"`
	Title    string        `json:"title,omitempty"`

	// Email
	From string   `json:"from,omitempty"`
	To   []string `json:"to,omitempty"`
	Cc   []string `json:"cc,omitempty"`
	Bcc  []string `json:"bcc,omitempty"`

	// Serialized data
	Data []byte `json:"data"`
}

func (p *PushNotification) Bytes() []byte {
	b, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}
	return b
}

func SendNotification(
	ctx context.Context,
	req queue.QueuedMessage,
	cfg *config.Config,
) (resp *ResponsePush, err error) {
	val, ok := req.(*PushNotification)
	if !ok {
		if err := json.Unmarshal(req.Bytes(), &val); err != nil {
			return nil, err
		}
	}

	switch val.Platform {
	case enum.EMAIL:
		resp, err = ESInstance.SendNotification(ctx, val, cfg)
	case enum.INAPP:
		fmt.Printf("implement me\n")
	case enum.ANDROID:
		fmt.Printf("implement me\n")
	case enum.IOS:
		fmt.Printf("implement me\n")
	default:
		err = msg.ErrInvalidRequest
	}
	return
}

var Run = func(cfg *config.Config) func(ctx context.Context, msg queue.QueuedMessage) error {
	return func(ctx context.Context, msg queue.QueuedMessage) error {
		_, err := SendNotification(ctx, msg, cfg)
		return err
	}
}
