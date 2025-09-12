package request

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Layout struct {
	ProjectType string `json:"projectType"`
	Name        string `json:"name,omitempty"`
	Phone       string `json:"phone"`
}

func (req Layout) Validate(c *gin.Context) {
	if req.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Телефон обязателен для заполнения",
		})
		log.Println("Validation: Телефон обязателен для заполнения")
		return
	}
	if req.ProjectType == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Тип проекта обязателен для заполнения",
		})
		log.Println("Validation: ProjectType обязателен для заполнения")
		return
	}

}

type Layout2 struct {
	Name  string `json:"name"`
	Phone string `json:"phone"`
}

func (req Layout2) Validate(c *gin.Context) {
	if req.Phone == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Телефон обязателен для заполнения",
		})
		log.Println("Validation: Телефон обязателен для заполнения")
		return
	}
	if req.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Имя обязателен для заполнения",
		})
		log.Println("Validation: Имя обязателен для заполнения")
		return
	}
}
