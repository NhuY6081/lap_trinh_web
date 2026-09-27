async function searchStudent() {

    const keyword =
        document.getElementById("keyword").value.trim();

    const message =
        document.getElementById("message");

    const studentList =
        document.getElementById("studentList");


    message.innerText = "Đang tải dữ liệu...";

    studentList.innerHTML = "";


    try {

        // Tạo URL API

        let url = "/api/bai2";


        // Nếu có từ khóa thì thêm vào API

        if (keyword !== "") {

            url +=
                "?keyword=" +
                encodeURIComponent(keyword);

        }


        // Gọi API Node-RED

        const response =
            await fetch(url);


        // Kiểm tra HTTP

        if (!response.ok) {

            throw new Error(
                "HTTP Error: " +
                response.status
            );

        }


        // Chuyển JSON

        const data =
            await response.json();


        // Kiểm tra API

        if (data.ok !== 1) {

            throw new Error(
                "API trả về lỗi"
            );

        }


        // Hiển thị số lượng

        message.innerText =
            `Tìm thấy ${data.total} sinh viên`;


        // Nếu không có kết quả

        if (data.total === 0) {

            studentList.innerHTML = `
                <div class="student-card">
                    Không tìm thấy sinh viên.
                </div>
            `;

            return;

        }


        // Hiển thị danh sách

        data.dssv.forEach(
            function(student) {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "student-card";


                card.innerHTML = `

                    <h3>
                        👤 ${student.name}
                    </h3>

                    <div class="info">
                        MSSV:
                        ${student.mssv}
                    </div>

                    <div class="info">
                        📖 Sách:
                        ${student.book}
                    </div>

                    <div class="info">
                        ⏰ Quá hạn:
                        ${student.daysLate}
                        ngày
                    </div>

                    <div class="money">
                        💰 ${formatMoney(
                            student.money
                        )}
                    </div>

                    <span class="status">
                        ${student.status}
                    </span>

                `;


                studentList.appendChild(card);

            }
        );


    } catch (error) {

        console.error(error);

        message.innerText =
            "Không thể kết nối API.";

        studentList.innerHTML = `
            <div class="student-card">
                ❌ Đã xảy ra lỗi khi
                kết nối đến máy chủ.
            </div>
        `;

    }

}


/*
    Format tiền Việt Nam
*/

function formatMoney(money) {

    return new Intl.NumberFormat(
        "vi-VN",
        {
            style: "currency",
            currency: "VND"
        }
    ).format(money);

}


/*
    Nhấn Enter để tìm kiếm
*/

document
    .getElementById("keyword")
    .addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                searchStudent();

            }

        }
    );


/*
    Tự động tải dữ liệu
    khi mở website
*/

searchStudent();
