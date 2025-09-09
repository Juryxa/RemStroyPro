package request

import (
	"log"
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
)

const (
	Repair serviceType = "Ремонт"
	Build  serviceType = "Стройка"
)

type serviceType string

type ServiceReq struct {
	Service serviceType `json:"service"`
	Type    string      `json:"type"`
	Name    string      `json:"name,omitempty"`
	Phone   string      `json:"phone"`
}

func validServiceType() []serviceType {
	return []serviceType{Repair, Build}
}

func (s serviceType) isValid() bool {
	return slices.Contains(validServiceType(), s)
}

func (req ServiceReq) Validation(c *gin.Context) {
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

	if !req.Service.isValid() {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":          "Такого сервиса нет",
			"valid_services": validServiceType(),
		})
		log.Printf("Validation: Такого сервиса нет: %v\n", req.Service)

		return
	}
}
