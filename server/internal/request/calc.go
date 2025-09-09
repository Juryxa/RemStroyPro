package request

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Calc struct {
	Place  string `json:"place,omitempty"`
	Square string `json:"square"`
	Type   string `json:"type"`
	Name   string `json:"name,omitempty"`
	Phone  string `json:"phone"`
}

func (req Calc) Validate(c *gin.Context) {
	if req.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Телефон обязателен для заполнения",
		})
		log.Println("Validation: Телефон обязателен для заполнения")
		return
	}
	if req.Type == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Тип услуги обязателен для заполнения",
		})
		log.Println("Validation: Тип услуги обязателен для заполнения")

		return
	}
	if req.Square == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Площадь обязательна для заполнения",
		})
		log.Println("Validation: Тип услуги обязателен для заполнения")

		return
	}
}
