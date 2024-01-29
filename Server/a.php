<?php
// Nhận dữ liệu từ yêu cầu POST
$jsonData = file_get_contents('php://input');
$data = json_decode($jsonData, true);

// Kiểm tra xem dữ liệu có tồn tại và có chứa trường "data" không
if ($data && isset($data['data'])) {
    // Lấy dữ liệu từ trường "data"
    $receivedData = $data['data'];

    // Trả về dữ liệu nhận được kèm theo mã 200 OK
    $response = array('data' => $receivedData);
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($response);
} else {
    // Trả về mã lỗi 400 Bad Request nếu dữ liệu không hợp lệ
    http_response_code(400);
    echo "Bad Request";
}
?>
