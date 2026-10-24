# OWASP cho AI Security: ba bộ Top 10 cần nắm {#owasp-ai-security}

OWASP có **ba bộ Top 10 cho AI**: LLM Applications 2025, Agentic Applications 2026 và MCP Top 10. Chúng lần lượt bảo vệ ứng dụng LLM, agent tự hành động và tầng kết nối tool. Rủi ro số một ở cả ba là lệnh độc trong dữ liệu đầu vào. Vì vậy phải giới hạn thiệt hại bằng kiến trúc, không chỉ dựa vào bộ lọc.

- LLM Top 10 2025 bao phủ ứng dụng hỏi đáp, RAG và output của model; LLM01 Prompt Injection đứng đầu.[](source:llm-top10)
- Agentic Top 10 2026 (ra ngày 9/12/2025) nhắm vào agent có quyền gửi mail, chạy lệnh, gọi API; ASI01 Agent Goal Hijack đứng đầu.[](source:agentic-top10)
- MCP Top 10 tập trung vào MCP server, token và tool poisoning; bản hiện tại là v0.1, đang thử nghiệm.[](source:mcp-top10)
- Agent cũng là ứng dụng LLM, nên một hệ thống agent phải xét cả ba bộ cùng lúc.

@answer scope="Tổng hợp từ dàn ý seminar AI Security (file nháp) và trang chính thức OWASP · trạng thái cuối 2026 · MCP Top 10 còn ở bản beta, thứ hạng có thể đổi"
@meta locale=en
@source draft title="Dàn ý seminar AI Security (FILE NHÁP)" url=https://docs.google.com/document/d/10sR9X-nVKb5lt8T7F-ZRfCF0FjCb5pF2OG8k129IehA/edit
@source llm-top10 title="OWASP Top 10 for LLM Applications 2025" url=https://genai.owasp.org/llm-top-10/
@source agentic-top10 title="OWASP Top 10 for Agentic Applications for 2026" url=https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
@source mcp-top10 title="OWASP MCP Top 10" url=https://owasp.org/www-project-mcp-top-10/
@source atlas title="MITRE ATLAS" url=https://atlas.mitre.org/
@source nist-rmf title="NIST AI Risk Management Framework" url=https://www.nist.gov/itl/ai-risk-management-framework

## Mỗi bộ OWASP bảo vệ tầng nào của hệ thống AI? {#layers}

@architecture id=ai-surface title="Bề mặt tấn công của một hệ thống AI"
| user | Người dùng | frontend |
| content | Nội dung ngoài | external |
| app | Ứng dụng LLM | backend |
| model | Model | cloud |
| rag | Kho RAG | database |
| agent | Agent | backend |
| mcp | MCP server | messagebus |
| tools | Tool và API | external |
| supply | Chuỗi cung ứng | security |
| user > app | prompt | |
| content > rag | tài liệu | dashed |
| app > model | gọi model | |
| rag > app | ngữ cảnh | |
| app > agent | giao việc | emphasis |
| agent > mcp | gọi tool | emphasis |
| mcp > tools | thực thi | emphasis |
| supply > model | trọng số | dashed |

@steps id=layer-steps
| s-user | Người dùng | Prompt injection trực tiếp và jailbreak đi vào từ đây (LLM01). | ai-surface | user |
| s-content | Nội dung ngoài | Email, web, PDF, ảnh chứa lệnh ẩn: prompt injection gián tiếp (LLM01, ASI01). | ai-surface | content |
| s-app | Ứng dụng LLM | Lộ system prompt, lộ dữ liệu, output không được kiểm soát (LLM02, LLM05, LLM07). | ai-surface | app |
| s-rag | Kho RAG | Đầu độc kho tài liệu, rò dữ liệu vượt quyền (LLM08, ASI06). | ai-surface | rag |
| s-agent | Agent | Quyền quá mức, bị chiếm mục tiêu, lỗi lan dây chuyền (LLM06, ASI01–ASI10). | ai-surface | agent |
| s-mcp | MCP server | Tool poisoning, token lộ, server giả mạo (MCP01–MCP10). | ai-surface | mcp |
| s-supply | Chuỗi cung ứng | Model độc, package giả, data poisoning (LLM03, LLM04, ASI04, MCP04). | ai-surface | supply |

## OWASP Top 10 for LLM Applications 2025 gồm những gì? {#llm-top10}

| Mã | Rủi ro | Ý nghĩa ngắn | Phòng chống chính |
| --- | --- | --- | --- |
| LLM01 | Prompt Injection | Lệnh độc trong input hoặc tài liệu làm model đổi hành vi. | Tách dữ liệu không tin cậy, giới hạn quyền, người duyệt hành động nguy hiểm. |
| LLM02 | Sensitive Information Disclosure | Model hoặc RAG trả về dữ liệu mật, PII, secret. | Lọc dữ liệu trước khi đưa vào, phân quyền theo người dùng. |
| LLM03 | Supply Chain | Model, dataset, thư viện hoặc plugin bị chèn mã độc. | Quét file model, dùng safetensors, lập AI-BOM, ký số. |
| LLM04 | Data and Model Poisoning | Dữ liệu huấn luyện hoặc fine-tune bị cài backdoor. | Kiểm soát nguồn dữ liệu, đánh giá model sau huấn luyện. |
| LLM05 | Improper Output Handling | Output đưa thẳng vào trình duyệt, shell, SQL gây XSS hoặc injection. | Coi output là input không tin cậy; encode và kiểm tra. |
| LLM06 | Excessive Agency | Ứng dụng cho model quá nhiều tool, quyền hoặc tự chủ. | Quyền tối thiểu, tool hẹp, human-in-the-loop. |
| LLM07 | System Prompt Leakage | System prompt lộ ra, kèm secret hoặc luật nội bộ. | Không đặt secret trong prompt; kiểm soát quyền ở backend. |
| LLM08 | Vector and Embedding Weaknesses | Kho vector bị đầu độc hoặc trả tài liệu vượt quyền. | Phân quyền trong RAG, kiểm tra nguồn tài liệu. |
| LLM09 | Misinformation | Model bịa thông tin, kể cả tên package không tồn tại. | Đối chiếu nguồn, kiểm tra package trước khi cài. |
| LLM10 | Unbounded Consumption | Lạm dụng API gây tốn chi phí, từ chối dịch vụ, đánh cắp model. | Rate limit, hạn mức chi phí, giám sát sử dụng. |

## OWASP Top 10 for Agentic Applications 2026 gồm những gì? {#agentic-top10}

| Mã | Rủi ro | Ý nghĩa ngắn | Phòng chống chính |
| --- | --- | --- | --- |
| ASI01 | Agent Goal Hijack | Văn bản agent đọc được lái mục tiêu của agent sang ý kẻ tấn công. | Tách nội dung không tin cậy, xác nhận lại mục tiêu trước hành động lớn. |
| ASI02 | Tool Misuse and Exploitation | Agent dùng tool hợp lệ theo cách gây hại. | Least agency: tool hẹp, tham số được kiểm tra. |
| ASI03 | Identity and Privilege Abuse | Agent mượn hoặc leo thang danh tính, quyền của người dùng. | Danh tính riêng cho agent, token ngắn hạn, quyền theo tác vụ. |
| ASI04 | Agentic Supply Chain Vulnerabilities | Tool, plugin, agent bên thứ ba hoặc MCP server bị chèn mã độc. | Danh mục thành phần được phép, kiểm tra và ghim phiên bản. |
| ASI05 | Unexpected Code Execution (RCE) | Agent sinh hoặc chạy code ngoài dự kiến. | Sandbox, không chạy code trên máy có secret. |
| ASI06 | Memory and Context Poisoning | Bộ nhớ dài hạn hoặc ngữ cảnh bị cài thông tin độc. | Kiểm tra dữ liệu ghi vào bộ nhớ, tách bộ nhớ theo người dùng. |
| ASI07 | Insecure Inter-Agent Communication | Tin nhắn giữa các agent bị giả mạo hoặc chặn. | Xác thực và ký tin nhắn giữa agent. |
| ASI08 | Cascading Failures | Lỗi một agent lan qua cả chuỗi agent. | Giới hạn phạm vi, circuit breaker, kiểm tra ở từng bước. |
| ASI09 | Human-Agent Trust Exploitation | Agent thuyết phục người dùng duyệt hành động nguy hiểm. | Hiển thị rõ hành động và rủi ro trước khi duyệt. |
| ASI10 | Rogue Agents | Agent hoạt động ngoài phạm vi, không còn kiểm soát được. | Giám sát hành vi, kill switch. |

## OWASP MCP Top 10 gồm những gì? {#mcp-top10}

| Mã | Rủi ro | Ý nghĩa ngắn |
| --- | --- | --- |
| MCP01 | Token Mismanagement and Secret Exposure | Token dài hạn, secret hard-code bị lộ qua prompt injection hoặc log debug. |
| MCP02 | Privilege Escalation via Scope Creep | Quyền của MCP server phình dần vượt nhu cầu. |
| MCP03 | Tool Poisoning | Mô tả tool chứa lệnh ẩn; tool đổi hành vi sau khi được tin (rug pull). |
| MCP04 | Software Supply Chain Attacks and Dependency Tampering | Package hoặc MCP server giả mạo, dependency bị sửa. |
| MCP05 | Command Injection and Execution | Tham số từ model chạy thành lệnh trên server. |
| MCP06 | Intent Flow Subversion | Nội dung trong ngữ cảnh lái luồng ý định của agent. |
| MCP07 | Insufficient Authentication and Authorization | MCP server không xác thực hoặc phân quyền đủ chặt. |
| MCP08 | Lack of Audit and Telemetry | Không có log để biết tool nào đã chạy, với tham số gì. |
| MCP09 | Shadow MCP Servers | MCP server tự dựng, nằm ngoài quản trị bảo mật. |
| MCP10 | Context Injection and Over-Sharing | Ngữ cảnh dùng chung làm dữ liệu của tác vụ này lọt sang tác vụ khác. |

@callout level=note title="Trạng thái MCP Top 10"
OWASP ghi MCP Top 10 là dự án incubator, phiên bản 0.1, đang ở giai đoạn thử nghiệm. Tên mục ổn định để trích dẫn, nhưng thứ hạng có thể còn đổi.

## Kỹ thuật tấn công theo tầng ứng với mã OWASP nào? {#attack-map}

| Tầng | Kỹ thuật tấn công | Mã OWASP |
| --- | --- | --- |
| Dữ liệu huấn luyện | Data poisoning, backdoor, trojan | LLM04 |
| Model | Model stealing, membership inference, model inversion, adversarial examples, file pickle độc | LLM03, LLM04, LLM10 |
| Ứng dụng LLM | Prompt injection, jailbreak, lộ system prompt, XSS hoặc SQL injection qua output | LLM01, LLM05, LLM07 |
| RAG | Đầu độc kho tài liệu, rò dữ liệu vượt quyền, tấn công vector và embedding | LLM02, LLM08, ASI06 |
| Agent và tool | Tool poisoning, chiếm quyền agent, leo thang đặc quyền, lạm dụng tool, tấn công giữa agent | LLM06, ASI01–ASI03, ASI07, MCP03 |
| Hạ tầng | Denial of wallet, đánh cắp API key, chuỗi cung ứng | LLM10, LLM03, MCP01, MCP04 |

Mỗi kỹ thuật cũng có mã tương ứng trong MITRE ATLAS; dùng ATLAS khi cần mô tả chuỗi tấn công chi tiết theo chiến thuật.[](source:atlas)

## Sự cố thật nào minh họa các rủi ro OWASP? {#incidents}

| Sự cố | Chuyện gì xảy ra | Mã OWASP | Lẽ ra chặn ở đâu |
| --- | --- | --- | --- |
| EchoLeak trên M365 Copilot (2025) | Một email khiến Copilot tự đọc và đẩy dữ liệu ra ngoài qua link hoặc ảnh, không cần click. | LLM01, LLM02, ASI01 | Chặn render link và ảnh trỏ ra ngoài. |
| Extension Amazon Q (2025) | Prompt xóa dữ liệu bị chèn vào extension AI coding. | ASI02, ASI04, LLM06 | Kiểm soát chuỗi cung ứng, quyền tối thiểu cho agent. |
| Nx "s1ngularity" (2025) | Mã độc gọi CLI AI trên máy nạn nhân để dò secret. | ASI05, LLM03, MCP01 | Sandbox, không để secret trên máy chạy agent. |
| Model độc trên Hugging Face | File pickle chạy mã khi nạp model. | LLM03 | Quét file model, dùng safetensors. |
| Slopsquatting | Kẻ tấn công đăng ký trước tên package mà LLM hay bịa. | LLM09, LLM03 | Kiểm tra package trước khi cài. |
| Tool poisoning và rug pull | Mô tả tool chứa lệnh ẩn hoặc tool đổi hành vi sau khi được tin. | MCP03, ASI04 | Ghim phiên bản, duyệt mô tả tool. |
| Backdoor bằng vài trăm tài liệu (Anthropic và UK AISI, 2025) | Vài trăm tài liệu độc đủ cài backdoor, bất kể kích thước model. | LLM04 | Kiểm soát nguồn dữ liệu huấn luyện. |

@callout level=warning title="Kiểm tra lại số liệu"
Dàn ý gốc ghi chú: kiểm tra lại chi tiết và số liệu từng sự cố từ nguồn gốc trước khi đưa lên slide.[](source:draft)

## Phòng thủ theo tầng giảm những rủi ro nào? {#defense}

| Lớp phòng thủ | Biện pháp | Giảm rủi ro |
| --- | --- | --- |
| Thiết kế | Quyền tối thiểu cho agent, tách dữ liệu tin cậy và không tin cậy, human-in-the-loop | LLM01, LLM06, ASI01–ASI03, ASI09 |
| Đầu vào và đầu ra | Guardrail, bộ phân loại prompt injection, encode output, chặn link hoặc ảnh ra ngoài | LLM01, LLM02, LLM05 |
| Dữ liệu và model | Kiểm soát nguồn dữ liệu, quét file model, safetensors, AI-BOM, ký số model | LLM03, LLM04, ASI04, MCP04 |
| Hạ tầng | Sandbox, quản lý secret, rate limit, phân quyền RAG theo người dùng | ASI05, LLM08, LLM10, MCP01, MCP07 |
| Vận hành | Log và giám sát agent, red teaming định kỳ, kế hoạch ứng phó sự cố AI | ASI08, ASI10, MCP08 |
| Con người và chính sách | Chính sách dùng AI, danh mục tool được phép, đào tạo nhận diện deepfake | MCP09, LLM02, ASI09 |

@callout level=warning title="Lethal trifecta"
Không để một agent cùng lúc có ba thứ: dữ liệu riêng tư, nội dung không tin cậy và kênh gửi dữ liệu ra ngoài.
Chưa có cách chặn prompt injection 100%, nên cắt bớt một trong ba thứ trên là cách giới hạn thiệt hại chắc chắn nhất.

## OWASP đứng ở đâu so với các khung chuẩn khác? {#frameworks}

| Khung | Loại | Dùng khi |
| --- | --- | --- |
| OWASP LLM, Agentic, MCP Top 10 | Danh mục rủi ro kỹ thuật, tự nguyện | Thiết kế và review bảo mật ứng dụng, agent, MCP |
| MITRE ATLAS | Ma trận chiến thuật và kỹ thuật tấn công | Mô hình hóa mối đe dọa, red teaming |
| NIST AI RMF | Khung quản trị rủi ro AI | Xây quy trình quản trị rủi ro trong tổ chức |
| ISO/IEC 42001 | Tiêu chuẩn hệ thống quản lý AI, có chứng nhận | Đấu thầu, chứng minh năng lực quản trị AI |
| EU AI Act | Luật, bắt buộc với hệ thống rủi ro cao từ 8/2026 | Sản phẩm AI phục vụ thị trường EU |
| Luật An ninh mạng, Nghị định 13/2023 | Pháp luật Việt Nam về an ninh mạng và dữ liệu cá nhân | Hệ thống AI xử lý dữ liệu người dùng Việt Nam |

OWASP Top 10 không phải khung tuân thủ; nó là danh sách rủi ro để đội kỹ thuật ưu tiên kiểm tra.[](source:agentic-top10) NIST AI RMF và ISO/IEC 42001 lo phần quản trị.[](source:nist-rmf)

## Cần làm gì ngay? {#checklist}

- [ ] Dev: liệt kê mọi tool và quyền của từng agent, bỏ quyền không cần (LLM06, ASI02).
- [ ] Dev: coi output của model là input không tin cậy trước khi render hoặc chạy (LLM05).
- [ ] Dev: kiểm tra package do AI gợi ý tồn tại và đúng nguồn trước khi cài (LLM09).
- [ ] Đội bảo mật: rà từng agent theo lethal trifecta, cắt ít nhất một trong ba thứ.
- [ ] Đội bảo mật: lập danh mục MCP server được phép, ghim phiên bản, bật log gọi tool (MCP03, MCP08, MCP09).
- [ ] Đội bảo mật: red team prompt injection gián tiếp qua email, web và tài liệu RAG (LLM01, ASI01).
- [ ] Lãnh đạo: ban hành chính sách dùng AI và danh mục công cụ được phép để giảm shadow AI.
- [ ] Lãnh đạo: xác định hệ thống nào chịu EU AI Act hoặc cần ISO/IEC 42001.
