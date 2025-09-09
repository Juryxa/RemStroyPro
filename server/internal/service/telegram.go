package service

import (
	"baulin_proj/internal/utils"
	"context"
	"fmt"
	"log"
	"time"

	"github.com/PaulSonOfLars/gotgbot/v2"
	"github.com/PaulSonOfLars/gotgbot/v2/ext"
	"github.com/PaulSonOfLars/gotgbot/v2/ext/handlers"
)

type telegramService struct {
	bot      *gotgbot.Bot
	chatID   int64
	botToken string
}

func NewTelegramService(botToken string, chatID int64) (*telegramService, error) {
	bot, err := gotgbot.NewBot(botToken, nil)
	if err != nil {
		return nil, err
	}
	return &telegramService{
		bot:      bot,
		chatID:   chatID,
		botToken: botToken,
	}, nil
}

func (s *telegramService) SendNotification(chatID int64, message string) error {
	_, err := s.bot.SendMessage(chatID, message, nil)
	return err
}

func (s *telegramService) StartBot(ctx context.Context) error {
	dispatcher := ext.NewDispatcher(&ext.DispatcherOpts{
		Error: func(b *gotgbot.Bot, ctx *ext.Context, err error) ext.DispatcherAction {
			log.Println("an error occurred while handling update:", err.Error())
			return ext.DispatcherActionNoop
		},
		MaxRoutines: ext.DefaultMaxRoutines,
	})

	updater := ext.NewUpdater(dispatcher, nil)

	dispatcher.AddHandler(handlers.NewCommand("start", s.handleStart))

	err := updater.StartPolling(s.bot, &ext.PollingOpts{
		DropPendingUpdates: true,
		GetUpdatesOpts: &gotgbot.GetUpdatesOpts{
			Timeout: 9,
			RequestOpts: &gotgbot.RequestOpts{
				Timeout: time.Second * 10,
			},
		},
	})
	if err != nil {
		return fmt.Errorf("failed to start polling: %w", err)
	}

	log.Printf("%s has been started...\n", s.bot.User.Username)

	<-ctx.Done()
	updater.Stop()

	return nil
}

func (s *telegramService) handleStart(b *gotgbot.Bot, ctx *ext.Context) error {
	user := ctx.EffectiveUser
	log.Printf("[tg] новый пользователь: @%s", user.Username)

	source := ""
	if ctx.Update.Message != nil && len(ctx.Update.Message.Text) > 7 {
		source = ctx.Update.Message.Text[7:]
	}
	if source == "" {
		return fmt.Errorf("ошибка не получилось распарсить ?start= параметр")
	}

	msg := fmt.Sprintf("👋 Привет, %s! С вами скоро свяжется наш менеджер.", user.FirstName)

	_, err := b.SendMessage(user.Id, msg, nil)
	if err != nil {
		return fmt.Errorf("failed to send message to user: %w", err)
	}

	sourceRu, ok := utils.Dicronary[source]
	if !ok {
		sourceRu = source
	}
	adminMsg := utils.CreateMsgWithTgUser(user, sourceRu)
	_, err = b.SendMessage(s.chatID, adminMsg, nil)
	if err != nil {
		return fmt.Errorf("failed to send message to admin: %w", err)
	}

	return nil
}
