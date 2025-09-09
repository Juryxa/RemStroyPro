package handler

import (
	"baulin_proj/internal/request"
	"baulin_proj/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type TelegramService interface {
	SendNotification(chatID int64, message string) error
}

type handler struct {
	tgService TelegramService
	chatID    int64
}

func NewHandler(tgService TelegramService, chatID int64) *handler {
	return &handler{
		tgService: tgService,
		chatID:    chatID,
	}
}

func (h *handler) HandleServiceRequest(c *gin.Context) {
	var req request.ServiceReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат данных",
		})
		return
	}

	req.Validation(c)

	msg := utils.CreateServiceTgMsg(req)
	if err := h.tgService.SendNotification(h.chatID, msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось отправить заявку",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Заявка отправлена",
	})
}

func (h *handler) HandleLayoutRequest(c *gin.Context) {
	var req request.Layout

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат данных",
		})
		return
	}

	req.Validate(c)

	msg := utils.CreateLayoutTgMsg(req)
	if err := h.tgService.SendNotification(h.chatID, msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось отправить заявку",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Заявка отправлена",
	})
}

func (h *handler) HandleCalcRequest(c *gin.Context) {
	var req request.Calc

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Неверный формат данных",
		})
		return
	}

	req.Validate(c)

	msg := utils.CreateCalcTgMsg(req)
	if err := h.tgService.SendNotification(h.chatID, msg); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Не удалось отправить заявку",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":  "success",
		"message": "Заявка отправлена",
	})
}
