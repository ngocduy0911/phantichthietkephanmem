# UML Diagrams for Hotel Management System

Tệp này tổng hợp các sơ đồ UML dưới dạng Mermaid để bạn có thể mở, chụp hình và chèn vào báo cáo HTML.  
Đề xuất sử dụng [https://mermaid.live/](https://mermaid.live/) hoặc mở trực tiếp trong IDE hỗ trợ Mermaid để xuất hình độ phân giải cao.

---

## 1. Sơ đồ kiến trúc mức cao

```mermaid
flowchart LR
    subgraph Client
        UI["EJS Views<br/>(rooms, bookings, invoices,<br/>dashboard, auth)"]
    end

    subgraph Server [Node.js Express Server]
        Router["Express Routers<br/>index / rooms / customers /<br/>bookings / invoices"]
        Controller["Controllers<br/>Auth / Room / Customer /<br/>Booking / Invoice / Dashboard"]
        ServiceLayer[("Business Logic<br/>& Validation")]
    end

    subgraph Data [MySQL Database]
        Users[("users")]
        Rooms[("rooms")]
        RoomTypes[("room_types")]
        Customers[("customers")]
        Bookings[("bookings")]
        BookingServices[("booking_services")]
        Services[("services")]
        Invoices[("invoices")]
    end

    UI -->|HTTP Request/Response| Router
    Router --> Controller
    Controller --> ServiceLayer
    ServiceLayer -->|SQL Queries| Data
    Data -->|Result Sets| ServiceLayer
```

---

## 2. Sequence Diagram – UC1: Tạo Booking

```mermaid
sequenceDiagram
    participant R as Receptionist
    participant View as bookings/create.ejs
    participant C as BookingController
    participant Room as Room Model
    participant Booking as Booking Model

    R->>View: Mở form tạo booking (GET)
    View->>C: POST /bookings (dữ liệu khách, phòng, thời gian)
    C->>Room: getById(room_id)
    Room-->>C: Thông tin phòng + giá
    C->>C: calculateRoomCharge()
    C->>Booking: create(bookingData)
    Booking->>Room: updateStatus(room_id, "reserved")
    Room-->>Booking: OK
    Booking-->>C: booking_id mới
    C-->>View: Redirect /bookings?success=create
    View-->>R: Thông báo tạo booking thành công
```

---

## 3. Sequence Diagram – UC2: Lập & Thanh toán Hóa đơn

```mermaid
sequenceDiagram
    participant A as Accountant/Receptionist
    participant View as invoices/create.ejs
    participant IC as InvoiceController
    participant Invoice as Invoice Model
    participant Booking as Booking Model

    A->>View: Chọn booking & mở màn tạo hóa đơn
    View->>IC: POST /invoices (chi tiết thu, chiết khấu, thanh toán)
    IC->>Invoice: create(invoiceData)
    Invoice-->>IC: invoice_id
    IC->>Booking: checkOut(booking_id) (khi payment_status = paid)
    Booking-->>IC: OK
    IC-->>View: Redirect /invoices/{invoice_id}?success=create
    View-->>A: Hiển thị hóa đơn & trạng thái thanh toán
```

---

## 4. Class Diagram – Lớp dữ liệu cốt lõi

```mermaid
classDiagram
    class User {
        +int user_id
        +string username
        +string password
        +string full_name
        +string email
        +string phone
        +enum role
        +bool is_active
        +getAll()
        +getById()
        +getByUsername()
        +create()
        +update()
        +changePassword()
    }

    class RoomType {
        +int type_id
        +string type_name
        +text description
        +decimal base_price
        +int max_occupancy
        +getAll()
        +getById()
        +create()
        +update()
    }

    class Room {
        +int room_id
        +string room_number
        +int type_id
        +int floor
        +enum status
        +string description
        +getAll()
        +getById()
        +getByRoomNumber()
        +getByStatus()
        +getAvailableRooms()
        +create()
        +update()
        +updateStatus()
        +delete()
        +getStatsByStatus()
    }

    class Customer {
        +int customer_id
        +string full_name
        +string id_card
        +string phone
        +string email
        +string address
        +date date_of_birth
        +string nationality
        +getAll()
        +getById()
        +getByIdCard()
        +search()
        +create()
        +update()
        +delete()
        +getBookingHistory()
    }

    class Booking {
        +int booking_id
        +int customer_id
        +int room_id
        +int user_id
        +date check_in_date
        +date check_out_date
        +int num_adults
        +int num_children
        +decimal total_price
        +decimal deposit
        +enum status
        +create()
        +update()
        +getAll()
        +getById()
        +getByStatus()
        +getToday()
        +checkIn()
        +checkOut()
        +cancel()
        +confirm()
        +calculateRoomCharge()
        +getMonthlyStats()
    }

    class Service {
        +int service_id
        +string service_name
        +text description
        +decimal price
        +string unit
        +bool is_active
        +getAll()
        +getActive()
        +getById()
        +create()
        +update()
        +delete()
    }

    class BookingService {
        +int booking_service_id
        +int booking_id
        +int service_id
        +int quantity
        +decimal price
        +decimal total_price
        +timestamp service_date
        +addBookingService()
        +getBookingServices()
    }

    class Invoice {
        +int invoice_id
        +int booking_id
        +decimal room_charge
        +decimal service_charge
        +decimal tax
        +decimal discount
        +decimal total_amount
        +decimal paid_amount
        +enum payment_method
        +enum payment_status
        +create()
        +update()
        +pay()
        +getAll()
        +getById()
        +getByBookingId()
        +getBookingServices()
        +calculateServiceCharge()
        +getRevenueByDateRange()
        +getMonthlyRevenue()
    }

    User "1" --> "many" Booking : created_by
    Customer "1" --> "many" Booking
    RoomType "1" --> "many" Room
    Room "1" --> "many" Booking
    Booking "1" --> "0..1" Invoice
    Booking "1" --> "many" BookingService
    Service "1" --> "many" BookingService
```

---

## 5. Ghi chú sử dụng

- Có thể chỉnh sửa lại tên tác nhân hoặc ghi chú trong biểu đồ để khớp với tài liệu tiếng Việt hoàn chỉnh trước khi chụp hình.
- Nếu cần thêm sơ đồ Use-case hoặc Activity, sao chép cấu trúc trên và điều chỉnh Mermaid tương ứng.
- Khi chụp hình, nên bật chế độ “Dark” hoặc “Light” theo phong cách của báo cáo để đồng nhất thị giác.

---

Chúc bạn hoàn thiện báo cáo thuận lợi!
