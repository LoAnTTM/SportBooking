package utility

import (
	"spb/bsa/api/order/model"
	tb "spb/bsa/pkg/entities"
)

func MapOrderItemsToResponse(orderItems []tb.OrderItem) []model.OrderItemResponse {
	var orderItemResponses []model.OrderItemResponse
	for _, item := range orderItems {
		orderItemResponse := model.OrderItemResponse{
			ID:       item.ID,
			Price:    item.Price,
			ItemID:   item.ItemID,
			ItemName: item.ItemName,
			ItemType: item.ItemType,
			Quantity: item.Quantity,
		}
		if item.StartTime != nil {
			orderItemResponse.StartTime = item.StartTime
		}
		if item.EndTime != nil {
			orderItemResponse.EndTime = item.EndTime
		}
		orderItemResponses = append(orderItemResponses, orderItemResponse)
	}
	return orderItemResponses
}

func MapOrderToResponse(order *tb.Order) model.OrderResponse {
	orderResponse := model.OrderResponse{
		ID:          order.ID,
		TotalAmount: order.TotalAmount,
		Currency:    order.Currency,
		Status:      string(order.Status),
		OrderItems:  MapOrderItemsToResponse(order.OrderItems),
		CreatedAt:   order.CreatedAt,
	}
	return orderResponse
}

func MapOrdersToResponse(orders []*tb.Order) model.OrdersResponse {
	ordersResponses := model.OrdersResponse{}
	ordersResponses.Orders = make([]model.OrderResponse, 0, len(orders))
	ordersResponses.Total = int64(len(orders))

	for _, order := range orders {
		ordersResponses.Orders = append(ordersResponses.Orders, MapOrderToResponse(order))
	}
	return ordersResponses
}
