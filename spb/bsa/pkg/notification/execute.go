package notification

import (
	"spb/bsa/pkg/aws/ses"
	"spb/bsa/pkg/config"
	"spb/bsa/pkg/logger"
	"spb/bsa/pkg/msg"
	"spb/bsa/pkg/queue"
	redisw "spb/bsa/pkg/queue/worker"

	"github.com/gofiber/storage/redis/v3"
)

type Notification struct {
	queue *queue.Queue
}

func NewNotification(
	configVal *config.Config,
	redisClient *redis.Storage,
	sesService ses.SESService,
) *Notification {
	notifConfig := configVal.Notification
	worker := redisw.NewWorker(
		redisw.WithRedisClient(redisClient),
		redisw.WithChannelName(notifConfig.RedisQueue.ChannelName),
		redisw.WithChannelSize(notifConfig.RedisQueue.ChannelSize),
		redisw.WithRunFunc(Run(configVal)),
	)

	redisQueue := queue.NewPool(
		int(notifConfig.RedisQueue.WorkerNum),
		queue.WithWorker(worker),
	)

	NewEmailService(sesService)

	return &Notification{
		queue: redisQueue,
	}
}

func Shutdown(n *Notification) {
	n.queue.Release()
	logger.Infof(msg.InfoShutdownNotification)
}

func (n *Notification) Notify(data *PushNotification) error {
	logger.Infof(msg.InfoSendNotification(data.Title, data.To))

	data.Data = data.Bytes()
	err := n.queue.Queue(data)
	if err != nil {
		logger.Errorf(msg.ErrSendNotificationFailed(err))
		return err
	}
	return nil
}
