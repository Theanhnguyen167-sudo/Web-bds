import { Article } from '@/types/article';
import { INITIAL_ARTICLES, getCategoryFallbackImage } from '@/lib/article-data';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: 'planning' | 'pricing' | 'policy' | 'project' | 'investment' | 'market' | 'analysis' | 'hanoi' | 'legal';
  categoryLabel: string;
  categoryColor: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
  views: number;
  featured?: boolean;
  content: string[];
  tags: string[];
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'gia-nha-ha-noi-nam-2026-xu-huong-va-kich-ban-dong-tien',
    title: 'Giá nhà Hà Nội năm 2026: Phân tích xu hướng biến động và kịch bản dòng tiền',
    summary: 'Phân tích toàn cảnh thị trường BĐS Thủ đô 2026 dưới tác động của Luật Đất đai mới và hạ tầng giao thông. Kịch bản phân bổ dòng tiền đầu tư an toàn.',
    category: 'market',
    categoryLabel: 'Tiêu điểm BĐS',
    categoryColor: 'bg-orange-600 text-white',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    date: '28/09/2026',
    author: 'Ban Phân tích Chiến lược & Viện Nghiên cứu Kinh tế HaNoi Realty',
    readTime: '10 phút đọc',
    views: 6240,
    featured: true,
    tags: ['Giá nhà Hà Nội 2026', 'Xu hướng BĐS Hà Nội', 'Kịch bản dòng tiền BĐS', 'Tỷ suất sinh lời căn hộ', 'Đầu tư an toàn'],
    content: [
      'Thị trường bất động sản Hà Nội trong năm 2026 đang thiết lập một chu kỳ tăng trưởng hoàn toàn khác biệt so với các chu kỳ sốt nóng trước đây. Không còn những đợt tăng giá đồng loạt dựa trên tâm lý đầu cơ bầy đàn hay các tin đồn quy hoạch vô căn cứ, mặt bằng giá nhà tại Thủ đô hiện nay được nâng đỡ bởi các yếu tố cơ bản vững chắc: chi phí vốn đầu vào tăng cao, nguồn cung dự án mới tiếp tục bị kiểm soát gắt gao bởi hành lang pháp lý mới và tốc độ giải ngân đầu tư công bứt phá tại các đại dự án hạ tầng giao thông kết nối vùng.',
      'Trước bối cảnh lạm phát tài sản toàn cầu và sự biến động khó lường của các kênh đầu tư tài chính khác, bất động sản Hà Nội tiếp tục khẳng định vị thế là tài sản phòng thủ chiến lược (Defensive Asset). Tuy nhiên, đằng sau bức tranh tăng trưởng ổn định là sự phân hóa dòng tiền sâu sắc, đòi hỏi các nhà đầu tư phải có tư duy phân tích định lượng và kịch bản quản trị vốn chặt chẽ.',
      '## 1. Bối cảnh & Số liệu: Chỉ số tăng trưởng và sự dịch chuyển mặt bằng giá',
      'Báo cáo thị trường bất động sản Hà Nội 9 tháng đầu năm 2026 của Savills Việt Nam và Batdongsan.com.vn phản ánh những con số tăng trưởng thực chất:',
      '• Chỉ số giá căn hộ chung cư: Giá sơ cấp trung bình toàn thành phố đã chạm ngưỡng 82,5 triệu đồng/m² (chưa bao gồm VAT và kinh phí bảo trì), tăng 14,8% so với cùng kỳ năm 2025. Riêng tại khu vực lõi mở rộng (quận Cầu Giấy, Nam Từ Liêm, Tây Hồ), các dự án mới ra mắt đều có mức giá khởi điểm không dưới 95 – 135 triệu đồng/m².',
      '• Thị trường nhà liền thổ (Nhà phố, Biệt thự): Giá bán sơ cấp trung bình đạt 240 – 380 triệu đồng/m² đất tại các khu đô thị có hạ tầng hoàn chỉnh; nhà mặt phố kinh doanh tại các quận lõi nội đô Đống Đa, Ba Đình duy trì ngưỡng định giá từ 450 – 750 triệu đồng/m².',
      '• Hệ số hấp thụ thị trường (Absorption Rate): Mặc dù giá tăng cao, tỷ lệ hấp thụ lũy kế của các dự án mở bán mới trong quý III/2026 vẫn đạt mức ấn tượng 76,5%, chứng minh lực cầu an cư và tích sản của tầng lớp trung lưu và thượng lưu tại Thủ đô vẫn vô cùng mạnh mẽ.',
      '• Tỷ suất sinh lời từ cho thuê (Gross Rental Yield): Tỷ suất lợi nhuận cho thuê căn hộ tại Hà Nội dao động ổn định trong khoảng 5,2% – 5,8%/năm, cao hơn mức trung bình 4,1% của TP. Hồ Chí Minh. Cộng gộp với mức tăng giá vốn trung bình hàng năm từ 8% – 10%, tổng tỷ suất lợi nhuận kỳ vọng của nhà đầu tư nắm giữ căn hộ trung cao cấp đạt từ 13% – 15%/năm.',
      '[CHÈN ẢNH: Đồ thị phân tích diễn biến chỉ số giá nhà đất Hà Nội từ năm 2021 đến 2026, so sánh tương quan giữa giá sơ cấp căn hộ và tỷ suất lợi nhuận cho thuê - Alt-text: Giá nhà Hà Nội năm 2026: Phân tích xu hướng biến động và kịch bản dòng tiền - Tìm kiếm: site:vnexpress.net + bieu do gia nha ha noi 2026 tang truong cbre]',
      '## 2. Phân tích Luật & Quy hoạch: Lực đẩy cộng hưởng từ khung pháp lý và hạ tầng kỹ thuật',
      'Nguyên nhân cốt lõi tạo nên sự bền vững của mặt bằng giá nhà Hà Nội năm 2026 bắt nguồn từ hai trụ cột thể chế và quy hoạch:',
      'Về thể chế: Căn cứ Điều 24 Luật Kinh doanh Bất động sản số 29/2023/QH15, chủ đầu tư dự án chỉ được thu tiền đặt cọc không quá 5% giá bán nhà ở, công trình xây dựng khi nhà ở đã có đủ các điều kiện đưa vào kinh doanh. Quy định này đã triệt tiêu hoàn toàn tình trạng "bán lúa non", huy động vốn trái phép khi chưa hoàn tất xây dựng phần móng. Bên cạnh đó, Luật Nhà ở 2023 bãi bỏ quy định thời hạn sở hữu nhà chung cư, củng cố vững chắc tâm lý an tâm tích sản lâu dài của người dân.',
      'Về quy hoạch không gian: Căn cứ Quyết định số 700/QĐ-TTg của Thủ tướng Chính phủ phê duyệt điều chỉnh Quy hoạch chung Thủ đô Hà Nội đến năm 2045, tầm nhìn đến năm 2065, Hà Nội kiên định phát triển mô hình thành phố đa cực, đa trung tâm với hai thành phố trực thuộc: Thành phố phía Bắc (Đông Anh, Mê Linh, Sóc Sơn) và Thành phố phía Tây (Hòa Lạc, Xuân Mai). Các đại dự án hạ tầng giao thông bước vào giai đoạn về đích trong năm 2026: Tuyến Metro số 3 (Nhổn – Ga Hà Nội) vận hành toàn tuyến ngầm; Vành đai 4 thông xe kỹ thuật phân đoạn lớn qua Hà Nội; cầu Tứ Liên và cầu Trần Hưng Đạo xúc tiến triển khai xây dựng.',
      '[CHÈN ẢNH: Toàn cảnh công trường thi công tuyến Metro số 3 đoạn trên cao và ga ngầm qua trung tâm Hà Nội kết nối chuỗi đại đô thị - Alt-text: Giá nhà Hà Nội năm 2026: Phân tích xu hướng biến động và kịch bản dòng tiền - Tìm kiếm: site:vnexpress.net + metro nhon ga ha noi cong truong thi cong]',
      '## 3. Đánh giá chuyên gia: Cân nhắc giữa rủi ro phân hóa và cơ hội tái lập danh mục',
      'Dưới góc độ chuyên môn, các chuyên gia tài chính BĐS nhận định thị trường năm 2026 chứa đựng những chuyển động phân hóa rất sâu sắc:',
      'Về mặt cơ hội: Sự khan hiếm nguồn cung pháp lý chuẩn tạo ra lợi thế tuyệt đối cho các dự án đã hoàn thành cấp phép và đang xây dựng đúng tiến độ. Những sản phẩm này có tính thanh khoản rất cao và biên độ trượt giá gần như bằng không. Đồng thời, xu hướng dịch chuyển sang mô hình "đại đô thị tích hợp" (Integrated Township) có đầy đủ trường học, bệnh viện, trung tâm thương mại và công viên sinh thái duy trì tốc độ tăng trưởng giá trị vượt trội.',
      'Về mặt rủi ro: Rủi ro "thanh khoản đóng băng cục bộ" tại phân khúc bất động sản đầu cơ không tạo ra giá trị sử dụng thực. Các khu đất nền phân lô tại vùng sâu vùng xa, không có hạ tầng kết nối và không có dân cư sinh sống gần như mất hoàn toàn thanh khoản. Ngoài ra, áp lực lãi suất cho vay mua nhà sau thời gian ưu đãi đòi hỏi nhà đầu tư phải tính toán khả năng trả nợ gốc lãi hàng tháng với biên dự phòng tối thiểu 2%.',
      '[CHÈN ẢNH: Khách hàng và nhà đầu tư giao dịch tại phòng trưng bày sa bàn của một dự án đại đô thị sinh thái quy mô lớn tại Hà Nội - Alt-text: Giá nhà Hà Nội năm 2026: Phân tích xu hướng biến động và kịch bản dòng tiền - Tìm kiếm: site:vnexpress.net + giao dich can ho ha noi 2026 phong trung bay sa ban]',
      '## 4. Lời khuyên đầu tư: 3 kịch bản định vị dòng tiền hiệu quả năm 2026',
      'Dựa trên phân tích dòng vốn vĩ mô, nhà đầu tư nên phân bổ danh mục tài sản theo 3 kịch bản chiến lược sau:',
      '• Kịch bản 1 - Bảo toàn vốn & Tối ưu dòng tiền (Tỷ trọng 50% danh mục): Nhắm vào căn hộ phân khúc trung – cao cấp tại các quận Đống Đa, Cầu Giấy, Nam Từ Liêm, Tây Hồ có vị trí tiệm cận ga Metro hoặc các trục giao thông chính. Đảm bảo tỷ suất dòng tiền ròng tối thiểu 5,5%/năm, kết hợp kỳ vọng tăng giá vốn ổn định 8% – 10%/năm.',
      '• Kịch bản 2 - Đón sóng hạ tầng dài hạn (Tỷ trọng 30% danh mục): Nhà phố, shophouse thương mại nằm trong các khu đô thị đồng bộ dọc hành lang Vành đai 3.5, Vành đai 4 tại Hoài Đức, Đan Phượng, Gia Lâm với tầm nhìn 3 - 5 năm khi các trục đại lộ thông xe toàn tuyến.',
      '• Kịch bản 3 - Dự phòng thanh khoản cao (Tỷ trọng 20% danh mục): Tiền gửi tiết kiệm kỳ hạn ngắn kết hợp chứng chỉ quỹ mở để luôn sẵn sàng lượng tiền mặt cơ động, chớp thời cơ giải ngân vào các tài sản bất động sản chất lượng cao khi có cơ hội chiết khấu tốt.',
      '> Khuyến nghị: Nhà đầu tư tuyệt đối không sử dụng đòn bẩy tài chính vượt quá 40% giá trị tài sản, ưu tiên các dự án đã có đầy đủ giấy phép xây dựng và chứng nhận quyền sử dụng đất.',
      'Nguồn tham khảo: Báo điện tử CafeF, Báo cáo Nghiên cứu Thị trường Quý III/2026 của Savills Việt Nam và Dữ liệu giá đất thực tế HaNoi Realty.'
    ]
  },
  {
    id: 'luat-dat-dai-moi-va-tac-dong-bang-gia-dat-ha-noi',
    title: 'Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội: Tái lập mặt bằng chi phí và áp lực tái cấu trúc dòng vốn',
    summary: 'Phân tích toàn diện việc bãi bỏ khung giá đất, bảng giá đất hàng năm từ 2026 tác động tới chi phí đầu vào, biên lợi nhuận chủ đầu tư và thanh khoản thị trường.',
    category: 'policy',
    categoryLabel: 'Chính sách & Pháp lý',
    categoryColor: 'bg-blue-600 text-white',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&auto=format&fit=crop&q=80',
    date: '27/09/2026',
    author: 'ThS. Nguyễn Hoàng Nam – Chuyên gia Phân tích Tài chính BĐS',
    readTime: '9 phút đọc',
    views: 5120,
    featured: false,
    tags: ['Luật Đất đai 2024', 'Bảng giá đất Hà Nội 2026', 'Chi phí giải phóng mặt bằng', 'Định giá đất thị trường'],
    content: [
      'Bước sang quý III/2026, thị trường bất động sản Thủ đô đang chứng kiến những tác động sâu rộng và trực diện nhất từ việc Luật Đất đai 2024 cùng các nghị định hướng dẫn thi hành đi vào đời sống thực tế tròn hai năm. Điểm nhấn mang tính cách mạng chính là việc chính thức xóa bỏ cơ chế "khung giá đất" do Chính phủ ban hành định kỳ 5 năm một lần, thay thế bằng cơ chế "Bảng giá đất hàng năm" do Ủy ban nhân dân cấp tỉnh/thành phố xây dựng và trình Hội đồng nhân dân cùng cấp thông qua, bắt đầu áp dụng từ ngày 01/01/2026.',
      'Sự thay đổi căn bản trong hành lang pháp lý không đơn thuần là một cuộc điều chỉnh kỹ thuật hành chính, mà là đòn bẩy tái lập toàn bộ mặt bằng chi phí đầu vào của các dự án phát triển đô thị. Tại Hà Nội – nơi áp lực đô thị hóa và giá trị địa tô luôn thuộc nhóm cao nhất cả nước – nguyên tắc định giá đất sát với giá trị thị trường thực tế đang tạo ra một cuộc sàng lọc khốc liệt đối với năng lực tài chính của các chủ đầu tư, đồng thời định hình lại hoàn toàn kỳ vọng lợi nhuận và hành vi của giới đầu tư địa ốc.',
      '[CHÈN ẢNH: Toàn cảnh kỳ họp HĐND Thành phố Hà Nội xem xét thông qua Nghị quyết về Bảng giá đất hàng năm và cơ chế định giá đất thị trường - Alt-text: Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội: Tái lập mặt bằng chi phí và áp lực tái cấu trúc dòng vốn - Tìm kiếm: site:vnexpress.net + hdnd ha noi thong qua bang gia dat luat dat dai]',
      '## 1. Bối cảnh & Số liệu: Áp lực chi phí đầu vào và sự co hẹp biên lợi nhuận',
      'Theo dữ liệu tổng hợp từ Báo cáo Nghiên cứu Thị trường Quý III/2026 của CBRE Việt Nam và CafeF, bảng giá đất mới ban hành của TP. Hà Nội ghi nhận mức điều chỉnh tăng trung bình từ 35% đến 65% so với chu kỳ trước tại các quận trung tâm như Ba Đình, Hoàn Kiếm, Đống Đa, Cầu Giấy; và tăng đột biến từ 70% đến 120% tại các khu vực đang có tốc độ phát triển hạ tầng kỹ thuật mạnh mẽ như Nam Từ Liêm, Bắc Từ Liêm, Hoài Đức, Gia Lâm và Đông Anh.',
      'Sự gia tăng mạnh mẽ này đã tác động trực tiếp vào cơ cấu giá thành sản phẩm:\n• Chi phí tiền sử dụng đất: Trước năm 2024, tiền sử dụng đất và chi phí bồi thường giải phóng mặt bằng (GPMB) chỉ chiếm khoảng 12% – 16% trong tổng mức đầu tư của một dự án căn hộ thương mại cao tầng. Đến quý III/2026, tỷ trọng này đã vọt lên ngưỡng 24% – 32%, trở thành cấu phần chi phí lớn thứ hai chỉ sau chi phí xây lắp kỹ thuật.\n• Biên lợi nhuận gộp (Gross Margin): Tỷ suất sinh lời của các dự án phát triển nhà ở sơ cấp bị thu hẹp đáng kể từ mức trung bình 25% – 28% giai đoạn 2021 – 2023 xuống còn khoảng 14% – 17% trong năm 2026.\n• Cơ cấu giỏ hàng sơ cấp: Dữ liệu từ Viện Nghiên cứu Bất động sản Việt Nam cho thấy, trong 9 tháng đầu năm 2026, 91% nguồn cung căn hộ mở bán mới tại thị trường Hà Nội thuộc phân khúc cao cấp (từ 75 – 110 triệu đồng/m²) và hạng sang (trên 120 triệu đồng/m²). Phân khúc nhà ở thương mại giá bình dân (dưới 45 triệu đồng/m²) đã chính thức biến mất hoàn toàn khỏi bản đồ nguồn cung sơ cấp.',
      '[CHÈN ẢNH: Biểu đồ dữ liệu phân tích cơ cấu chi phí tiền sử dụng đất trong tổng mức đầu tư dự án bất động sản trước và sau khi áp dụng Luật Đất đai mới - Alt-text: Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội - Tìm kiếm: site:vnexpress.net + co cau chi phi tien su dung dat du an ha noi 2026]',
      '## 2. Phân tích Luật & Cơ sở pháp lý: Nguyên tắc thị trường và các phương pháp định giá chuẩn hóa',
      'Về mặt thể chế, căn cứ quy định tại Điều 159 Luật Đất đai số 31/2024/QH15, Bảng giá đất được xây dựng theo khu vực, vị trí và đối với khu vực có bản đồ địa chính số hóa và cơ sở dữ liệu giá đất thì xây dựng đến từng thửa đất. Việc định giá không còn bị giới hạn bởi trần khung giá đất quốc gia, cho phép Thành phố Hà Nội tiệm cận với diễn biến giao dịch thực tế trên thị trường.',
      'Bên cạnh đó, việc thực thi Nghị định số 71/2024/NĐ-CP của Chính phủ quy định về giá đất đã chuẩn hóa 04 phương pháp định giá đất chính thống:\n1. Phương pháp so sánh: Đòi hỏi tối thiểu 03 tài sản so sánh có tính pháp lý tương đồng đã giao dịch thành công trên thị trường, triệt tiêu cơ chế thẩm định cảm tính.\n2. Phương pháp thu nhập: Căn cứ vào thu nhập ròng bình quân hàng năm do thửa đất mang lại chia cho lãi suất tiền gửi tiết kiệm bình quân, phản ánh đúng tỷ suất sinh lời thực tế.\n3. Phương pháp thặng dư: Áp dụng cho các thửa đất có tiềm năng phát triển, lấy tổng doanh thu phát triển giả định trừ đi tổng chi phí phát triển ước tính.\n4. Phương pháp hệ số điều chỉnh giá đất (Hệ số K): Được kiểm soát chặt chẽ và cập nhật thường xuyên theo biến động thị trường.',
      'Quy định mới tại Điều 247 Luật Đất đai 2024 và Luật Kinh doanh Bất động sản 2023 cũng bắt buộc toàn bộ giao dịch bất động sản của chủ đầu tư phải thanh toán qua tài khoản ngân hàng và ghi đúng giá trị thực trên hợp đồng chuyển nhượng. Hành lang pháp lý này đã triệt tiêu hoàn toàn hiện tượng "hai giá" vốn tồn tại dai dẳng hàng chục năm qua, tạo lập sự minh bạch tuyệt đối nhưng đồng thời đẩy chi phí tính thuế trước bạ, thuế thu nhập cá nhân từ chuyển nhượng và tiền thuê đất hàng năm của các doanh nghiệp lên một mặt bằng hoàn toàn mới.',
      '## 3. Đánh giá chuyên gia: Sự thanh lọc khốc liệt và bài toán phân hóa tính thanh khoản',
      'Dưới lăng kính phân tích tài chính vĩ mô, cơ chế định giá đất theo thị trường mang lại cả cơ hội bền vững lẫn rủi ro cấu trúc sâu sắc:',
      'Về mặt tích cực (Cơ hội): Tốc độ giải phóng mặt bằng các dự án trọng điểm được đẩy nhanh rõ rệt. Khi đơn giá đền bù sát giá thị trường, hiện tượng khiếu kiện đất đai kéo dài giảm tới 60%, giúp các dự án hạ tầng kỹ thuật và dự án phát sinh dòng tiền sớm đưa vào khai thác thương mại. Đồng thời, thị trường diễn ra quá trình thanh lọc tự nhiên mạnh mẽ: các tập đoàn có tiềm lực vốn chủ sở hữu vững mạnh, quản trị rủi ro chuyên nghiệp mới đủ khả năng triển khai dự án.',
      'Về mặt rủi ro (Thách thức): Áp lực thanh khoản đối với người mua nhà ở thực: Khi chi phí đất đai đẩy giá thành nhà ở vượt quá khả năng chi trả của phần đông dân cư có thu nhập trung bình (tỷ lệ giá nhà trên thu nhập trung bình tại Hà Nội năm 2026 đã vượt ngưỡng 22 lần), tính thanh khoản của thị trường sơ cấp có nguy cơ rơi vào trạng thái nén dòng tiền, làm giảm hệ số hấp thụ tại các dự án định giá quá cao.',
      '[CHÈN ẢNH: Dự án khu đô thị mới tại phía Tây Hà Nội với công trường hiện đại, máy móc cơ giới đang hoàn thiện cơ sở hạ tầng kỹ thuật và đường nội khu - Alt-text: Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội - Tìm kiếm: site:vnexpress.net + giai phong mat bang du an do thi ha noi luat dat dai]',
      '## 4. Lời khuyên đầu tư: 4 nguyên tắc điều hướng dòng tiền trong chu kỳ mới',
      'Để thích ứng với kỷ nguyên Bảng giá đất hàng năm và tối ưu hóa tỷ suất sinh lời, các nhà đầu tư cá nhân và tổ chức cần tuân thủ 4 nguyên tắc chiến lược:',
      '1. Thẩm định kỹ lưỡng nghĩa vụ tài chính đất đai: Trước khi quyết định xuống tiền mua đất nền hoặc nhà phố, nhà đầu tư phải kiểm tra thửa đất đã hoàn thành 100% nghĩa vụ nộp tiền sử dụng đất với Nhà nước theo bảng giá cũ hay chưa. Tránh tuyệt đối các sản phẩm đất chưa có sổ đỏ hoặc đang trong diện chờ chuyển đổi mục đích sử dụng đất, vì chi phí chuyển đổi sau năm 2026 sẽ cao gấp 2 – 3 lần so với trước đây.',
      '2. Ưu tiên bất động sản tạo dòng tiền ngay (Yield-generating Assets): Thay vì chiến lược đầu cơ đất nền chờ tăng giá vốn mang tính thụ động, nhà đầu tư nên chuyển dịch tỷ trọng danh mục sang các tài sản có thể khai thác thương mại ngay như căn hộ dịch vụ, nhà phố kinh doanh tại các trục giao thông huyết mạch để đảm bảo tỷ suất dòng tiền tối thiểu 5% – 6%/năm.',
      '3. Kiểm soát đòn bẩy tài chính với biên an toàn cao: Tỷ lệ nợ vay ngân hàng không nên vượt quá 40% giá trị tài sản. Lãi suất vay thả nổi cần được tính toán với kịch bản dự phòng tăng thêm 2% – 2,5% để đảm bảo không bị áp lực trả nợ ép phải bán cắt lỗ.',
      '4. Sử dụng công cụ kiểm tra quy hoạch số hóa: Tận dụng tối đa các nền tảng công nghệ số và hệ thống thông tin quy hoạch của Hà Nội để đối chiếu chỉ giới đường đỏ, phân khu chức năng, tránh các khu vực nằm trong kế hoạch thu hồi đất với đơn giá đền bù không bù đắp được chi phí mua ban đầu.',
      'Nguồn tham khảo: Báo điện tử VnExpress, Báo cáo Nghiên cứu Thị trường CBRE Việt Nam và Hệ thống Dữ liệu Pháp lý Đất đai Quốc gia.'
    ]
  },
  {
    id: 'metro-line-2-hanoi-gia-nha-pho-tang-12-phan-tram',
    title: 'Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công',
    summary: 'Bất động sản nhà phố trung tâm Hà Nội tăng trưởng 12% giá trị sau khi dự án đường sắt đô thị Metro Tuyến số 2 Nam Thăng Long - Trần Hưng Đạo đẩy nhanh tiến độ.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
    date: '26/09/2026',
    author: 'KS. Đặng Quốc Huy – Chuyên gia Quy hoạch Giao thông Đô thị',
    readTime: '9 phút đọc',
    views: 4890,
    featured: false,
    tags: ['Metro Line 2 Hà Nội', 'Tuyến Metro số 2', 'Giá nhà phố Hà Nội', 'Quy hoạch TOD Hà Nội'],
    content: [
      'Thông tin Ban Quản lý Đường sắt đô thị Hà Nội (MRB) chính thức hoàn tất công tác giải phóng mặt bằng các nhà ga ngầm trọng điểm và đẩy nhanh tiến độ thi công toàn diện dự án Tuyến đường sắt đô thị số 2 (đoạn Nam Thăng Long – Trần Hưng Đạo) trong quý III/2026 đã ngay lập tức kích hoạt một làn sóng tăng giá mạnh mẽ trên thị trường bất động sản nội đô.',
      'Là tuyến metro xuyên tâm đặc biệt quan trọng kết nối trực tiếp khu đô thị mới Tây Hồ Tây với trung tâm lịch sử Hoàn Kiếm, Metro Line 2 không chỉ giải quyết bài toán ách tắc giao thông nan giải mà còn đang tái cấu trúc lại toàn bộ hệ số sử dụng đất và giá trị thương mại của loại hình nhà phố mặt tiền dọc theo hành lang tuyến.',
      '[CHÈN ẢNH: Bản đồ đồ họa quy hoạch hướng tuyến Metro Line 2 Nam Thăng Long - Trần Hưng Đạo, đánh dấu cụ thể vị trí các ga ngầm lõi phố cổ C5 và ga trung chuyển C3 Tây Hồ Tây - Alt-text: Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công - Tìm kiếm: site:vnexpress.net + ban do quy hoach metro tuyen so 2 nam thang long tran hung dao]',
      '## 1. Bối cảnh & Số liệu: Giá nhà phố thiết lập mặt bằng mới dọc hành lang tuyến',
      'Khảo sát thực địa và dữ liệu giao dịch công chứng tại hệ thống HaNoi Realty trong 6 tháng qua ghi nhận:\n• Mức biến động giá bán: Giá chào nhượng quyền sở hữu nhà phố mặt tiền và nhà riêng trong ngõ ô tô tránh nhau dọc theo các tuyến đường Hoàng Hoa Thám, Thụy Khuê, Phan Đình Phùng, Hàng Giấy và khu vực Nam Thăng Long (Ciputra) đã ghi nhận mức tăng trưởng trung bình 11,8% – 13,5% so với đầu năm 2026.\n• Khu vực ga C1 (Xuân Đỉnh) & ga C2 (Ngoại Giao Đoàn): Giá nhà phố thương mại dao động từ 280 – 380 triệu đồng/m², tăng 14,2%.\n• Khu vực ga C3 (Tây Hồ Tây) & ga C4 (Bưởi - Hoàng Hoa Thám): Giá nhà mặt đường chạm mốc 420 – 580 triệu đồng/m², tăng 12,5%.\n• Khu vực ga ngầm lõi phố cổ C5 (Phan Đình Phùng - Hàng Đậu) & C6 (Hàng Gai - Hồ Hoàn Kiếm): Mức giá duy trì ở ngưỡng siêu đắt đỏ từ 650 triệu đến trên 1,1 tỷ đồng/m², thanh khoản gần như đóng băng do nguồn cung không có người bán ra.\n• Giá thuê mặt bằng kinh doanh (Commercial Rental Rates): Giá thuê sàn tầng 1 của các căn nhà phố nằm trong bán kính đi bộ 400m quanh các vị trí nhà ga ngầm dự kiến đã tăng từ 15% – 18%, với tỷ lệ lấp đầy đạt tới 96%.',
      '[CHÈN ẢNH: Đại công trường thi công nhà ga ngầm của tuyến đường sắt đô thị tại Hà Nội, máy móc khoan cọc nhồi hiện đại và kỹ sư đang giám sát kỹ thuật thi công - Alt-text: Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công - Tìm kiếm: site:vnexpress.net + cong truong thi cong ga ngam metro ha noi may dao ham]',
      '## 2. Phân tích Luật & Quy hoạch: Quy chuẩn TOD và cơ chế đặc thù từ Luật Thủ đô',
      'Sự tăng tốc thi công của Tuyến Metro số 2 trong năm 2026 được bảo chứng bởi những chuyển dịch mang tính đột phá về cơ chế chính sách:\nCăn cứ quy định của Luật Thủ đô số 39/2024/QH15, dự án được tháo gỡ nút thắt pháp lý quan trọng nhất nhờ việc áp dụng cơ chế đặc thù cho phép UBND Thành phố Hà Nội được chủ động điều chỉnh tổng mức đầu tư, phê duyệt phương án bồi thường hỗ trợ tái định cư theo giá thị trường và đặc biệt là cơ chế khai thác quỹ đất phụ cận các nhà ga đường sắt đô thị theo mô hình TOD (Transit-Oriented Development).',
      'Theo đồ án quy hoạch chi tiết các phân khu đô thị xung quanh các nhà ga Metro số 2, Thành phố định hướng phát triển các tổ hợp thương mại dịch vụ ngầm kết nối trực tiếp từ ga tàu vào tầng hầm của các tòa nhà lân cận. Cơ chế này biến các căn nhà phố mặt tiền và nhà liền kề xung quanh các ga ngầm thành các mắt xích thương mại đắc địa nhất, hưởng lợi trực tiếp từ lưu lượng hành khách ước tính lên tới 250.000 lượt khách/ngày đêm trong giai đoạn vận hành ban đầu.',
      '## 3. Đánh giá chuyên gia: Hiệu ứng cộng hưởng kinh tế và những thách thức kỹ thuật',
      'Dưới góc nhìn quy hoạch và đầu tư đô thị, cú hích từ Metro Line 2 tạo ra những chuyển biến hai chiều:\nVề mặt tiềm năng tăng trưởng: Kinh nghiệm thực tế từ các quốc gia trong khu vực như Singapore (hệ thống MRT), Tokyo (Nhật Bản) và Bangkok (hệ thống BTS/MRT) cho thấy, bất động sản nằm trong bán kính 500m quanh các ga ngầm luôn có tốc độ tăng giá cao hơn mặt bằng chung toàn thành phố từ 20% – 35% trong giai đoạn hoàn thiện và vận hành thương mại. Tuyến đường rút ngắn thời gian di chuyển từ khu vực Tây Bắc về trung tâm Bờ Hồ xuống dưới 15 phút, thúc đẩy nhu cầu thuê văn phòng chi nhánh và dịch vụ du lịch trải nghiệm cao cấp.',
      'Về mặt rủi ro và trở ngại: Quá trình đào hầm ngầm bằng công nghệ TBM (Tunnel Boring Machine) và thi công cừ cọc các nhà ga ngầm trong giai đoạn 2026 – 2028 sẽ gây áp lực bụi bặm, tiếng ồn và phân luồng giao thông tạm thời. Ngoài ra, theo quy chuẩn xây dựng công trình ngầm đô thị, phạm vi bảo vệ an toàn đường hầm có thể giới hạn chiều sâu đào móng và số tầng hầm của các công trình nhà ở liền kề.',
      '[CHÈN ẢNH: Tuyến phố thương mại cổ kính Thụy Khuê - Hoàng Hoa Thám với các cửa hàng kinh doanh sầm uất, cây xanh phủ bóng mát và xe cộ di chuyển tấp nập - Alt-text: Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công - Tìm kiếm: site:vnexpress.net + nha pho thuong mai thuy khue hoang hoa tham tay ho]',
      '## 4. Lời khuyên đầu tư: Bộ quy tắc 3 bước "đón đầu" dòng tiền dọc tuyến Metro',
      'Để tối ưu hóa tỷ suất sinh lời và phòng ngừa rủi ro quy hoạch khi giải ngân vào phân khúc nhà phố dọc Tuyến Metro số 2, nhà đầu tư cần thực hiện chuẩn xác 3 bước chiến lược:\n1. Định vị chính xác bán kính vàng (The Golden Radius): Khoảng cách lý tưởng nhất của bất động sản ăn theo ga metro là từ 250m đến 600m tính từ cửa lên xuống của nhà ga. Cự ly này vừa đủ gần để người đi bộ tiếp cận nhanh chóng trong vòng 3 – 5 phút, vừa đủ xa để tránh tiếng ồn, rung chấn và tình trạng ách tắc giao thông cục bộ tại cửa ga.\n2. Kiểm tra chặt chẽ chỉ giới hành lang an toàn đường ngầm: Trước khi đặt cọc mua bất động sản có giá trị lớn, nhà đầu tư phải nộp hồ sơ xin cung cấp thông tin quy hoạch tại Sở Quy hoạch – Kiến trúc Hà Nội hoặc Ban Quản lý Đường sắt đô thị để xác minh thửa đất có nằm trúng tọa độ đào hầm khiên đào TBM hay phạm vi giải tỏa phụ trợ của ga ngầm hay không.\n3. Ưu tiên bất động sản có khả năng chuyển đổi công năng linh hoạt: Nên lựa chọn các căn nhà có chiều ngang mặt tiền từ 4,5m trở lên, kết cấu móng bê tông cốt thép vững chắc có thể nâng cấp làm tòa nhà văn phòng cho thuê (Boutique Office), phòng khám chuyên khoa hoặc căn hộ dịch vụ cao cấp nhằm đảm bảo dòng tiền khai thác ròng ổn định ngay trong thời gian chờ tuyến metro chính thức cắt băng khánh thành.',
      'Nguồn tham khảo: Báo điện tử CafeF, Báo Giao thông, Thông cáo Báo chí Ban Quản lý Đường sắt Đô thị Hà Nội (MRB).'
    ]
  },
  {
    id: 'top-5-phuong-gia-dat-tang-manh-nhat-dong-da-2026',
    title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế',
    summary: 'Số liệu chi tiết top 5 phường có tốc độ tăng trưởng giá đất và thanh khoản dẫn đầu quận Đống Đa năm 2026: Ô Chợ Dừa, Láng Hạ, Cát Linh, Trung Tự, Nam Đồng.',
    category: 'analysis',
    categoryLabel: 'Phân tích BĐS',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80',
    date: '24/09/2026',
    author: 'Viện Nghiên cứu Dữ liệu Bất động sản HaNoi Realty',
    readTime: '9 phút đọc',
    views: 4420,
    featured: false,
    tags: ['Giá đất quận Đống Đa 2026', 'Đất Ô Chợ Dừa', 'Nhà đất Láng Hạ', 'BĐS nội đô Hà Nội', 'Cải tạo chung cư cũ'],
    content: [
      'Trong cấu trúc địa lý đô thị của Hà Nội, quận Đống Đa từ lâu đã được mệnh danh là "trái tim dân sinh và thương mại" của thành phố. Với mật độ dân số cao bậc nhất cả nước (đạt trên 31.000 người/km²), hạ tầng kỹ thuật và hạ tầng xã hội đã phát triển hoàn chỉnh từ hệ thống bệnh viện đầu ngành (Bạch Mai, Da Liễu, Nhiệt Đới), trường đại học danh tiếng (Đại học Y, Ngoại Thương, Ngoại Giao, Luật) đến các hồ điều hòa sinh thái, đất đai tại Đống Đa luôn là dòng tài sản sở hữu tính phòng thủ và khả năng chống trượt giá mạnh mẽ nhất.',
      'Bước sang năm 2026, dưới tác động tổng hòa của bảng giá đất tiệm cận thị trường và tiến độ triển khai các đồ án quy hoạch cải tạo chung cư cũ quy mô lớn, giá đất tại quận Đống Đa tiếp tục thiết lập những cột mốc kỷ lục mới. Dữ liệu giao dịch thực tế cho thấy sự bứt phá mạnh mẽ nhưng phân hóa rõ nét giữa các phân khu hành chính.',
      '[CHÈN ẢNH: Bản đồ nhiệt bất động sản quận Đống Đa thể hiện phân vùng biến động giá đất và thanh khoản giao dịch công chứng tại 21 phường - Alt-text: Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế - Tìm kiếm: site:vnexpress.net + ban do gia dat quan dong da ha noi bien dong o cho dua lang ha]',
      '## 1. Bối cảnh & Số liệu: Bảng xếp hạng 5 phường dẫn đầu về biên độ tăng giá đất',
      'Dựa trên dữ liệu phân tích từ hơn 12.000 hồ sơ giao dịch công chứng thực tế và báo cáo chỉ số thị trường của Batdongsan.com.vn tính đến hết tháng 9/2026, dưới đây là chi tiết Top 5 phường có mức tăng trưởng giá trị bất động sản cao nhất quận Đống Đa trong vòng 12 tháng qua:',
      '1. Phường Ô Chợ Dừa (Quán quân +15,8%): Lợi thế tuyệt đối nhờ vị trí nút giao thông trọng điểm Hoàng Cầu – Xã Đàn – Tôn Đức Thắng, kết hợp tuyến đường sắt trên cao Cát Linh – Hà Đông chạy qua và cảnh quan thoáng đãng của hồ Hoàng Cầu. Đất mặt ngõ rộng kinh doanh ẩm thực, quán café và homestay tại đây có tính thanh khoản cực cao, thời gian hấp thụ trung bình của một căn nhà rao bán chỉ vỏn vẹn 22 ngày. Giá nhà ngõ ô tô đạt 260 – 330 triệu/m²; mặt phố kinh doanh đạt 580 – 750 triệu/m².',
      '2. Phường Láng Hạ (+13,4%): Mệnh danh là "Phố Wall của Thủ đô", nơi tập trung trụ sở của hàng chục ngân hàng thương mại, tập đoàn dầu khí và tòa nhà văn phòng hạng A-B. Nhu cầu thuê văn phòng chi nhánh và căn hộ dịch vụ cao cấp cho chuyên gia nước ngoài luôn duy trì tỷ lệ lấp đầy trên 94%, tạo bảo chứng vững chắc cho dòng tiền cho thuê với tỷ suất đạt 6,1%/năm. Giá nhà ngõ ô tô đạt 250 – 310 triệu/m²; mặt phố đạt 550 – 720 triệu/m².',
      '3. Phường Cát Linh (+12,9%): Hưởng lợi trực tiếp từ việc vận hành đồng bộ hai tuyến đường sắt đô thị: Tuyến 2A (Cát Linh – Hà Đông) và Tuyến số 3 (Nhổn – Ga Hà Nội), biến khu vực quanh ga trung chuyển Cát Linh thành trung tâm thương mại bán lẻ đa năng có giá trị thuê mặt bằng tăng tới 20% so với năm 2025.',
      '4. Phường Trung Tự (+11,2%): Điểm nóng của các đồ án cải tạo chung cư cũ quy mô lớn bậc nhất Hà Nội. Sóng kỳ vọng tái thiết đô thị và bố trí tái định cư tại chỗ đã kích thích giá trị đất thổ cư và nhà riêng liền kề tăng tốc đạt 210 – 260 triệu/m² trong ngõ.',
      '5. Phường Nam Đồng (+10,6%): Không gian sống trong lành ven hồ Đắc Di, cộng đồng dân trí cao và mạng lưới ẩm thực sầm uất phố Hồ Đắc Di – Đặng Văn Ngữ tạo ra lực cầu an cư vững chắc từ các gia đình có tiềm lực tài chính dồi dào, giá ngõ ô tô đạt 215 – 270 triệu/m².',
      '[CHÈN ẢNH: Toàn cảnh phố Láng Hạ nhìn từ trên cao với trục đường rộng thênh thang, hai bên là các cao ốc văn phòng kính xanh hiện đại và nhịp sống đô thị nhộn nhịp - Alt-text: Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế - Tìm kiếm: site:vnexpress.net + pho lang ha quan dong da cao oc van phong]',
      '## 2. Phân tích Luật & Quy hoạch: Lực đẩy từ quy hoạch H1-3 và chính sách cải tạo chung cư cũ',
      'Sự bứt phá giá đất quận Đống Đa năm 2026 chịu tác động sâu sắc từ các quyết định quy hoạch và văn bản quy phạm pháp luật sau:\nĐồ án Quy hoạch phân khu đô thị H1-3 tỷ lệ 1/2000 được phê duyệt đặt mục tiêu giảm mật độ xây dựng thô, tăng cường cây xanh mặt nước và kiểm soát nghiêm ngặt tầng cao công trình trong khu vực nội đô lịch sử. Hệ quả trực tiếp là nguồn cung bất động sản xây dựng mới tại Đống Đa tiệm cận mức 0%, biến mọi tài sản nhà đất thổ cư hiện hữu thành "hàng hiếm", được hưởng lợi từ quy luật khan hiếm tuyệt đối của kinh tế học địa tô.',
      'Về chính sách cải tạo chung cư cũ theo Luật Nhà ở 2023 và Nghị định 69/2021/NĐ-CP: Đống Đa là quận có số lượng nhà tập thể cũ lớn nhất Thủ đô (với các cụm tiêu biểu: Kim Liên, Trung Tự, Khương Thượng, Hào Nam). Việc Luật Nhà ở 2023 chính thức hạ tỷ lệ đồng thuận của các chủ sở hữu nhà chung cư để thông qua phương án bồi thường, tái định cư xuống còn 70% – 75% (thay vì 100% như quy định cũ) đã tháo gỡ hoàn toàn điểm nghẽn pháp lý. Các tập đoàn bất động sản lớn được phê duyệt quy hoạch tổng mặt bằng 1/500 các khu tập thể Trung Tự, Kim Liên đã tạo nên xung lực tăng giá lan tỏa cho toàn bộ đất thổ cư tiếp giáp xung quanh.',
      '## 3. Đánh giá chuyên gia: Cung - cầu bất đối xứng và các rủi ro pháp lý tiềm ẩn',
      'Đánh giá một cách khách quan, bất động sản quận Đống Đa luôn là "miền đất hứa" cho dòng vốn phòng thủ nhưng đòi hỏi sự tinh tường trong thẩm định:\nƯu thế nổi trội: Tính thanh khoản gần như tuyệt đối. Nếu như tại vùng ven, một mảnh đất nền có thể mất 6 – 12 tháng mới tìm được người mua trong giai đoạn thị trường chững lại, thì tại Đống Đa, nhà đất có mức giá hợp lý dưới 15 tỷ đồng luôn có giao dịch hoàn tất trong vòng dưới 30 ngày.',
      'Rủi ro cốt lõi cần lưu ý:\nRủi ro tranh chấp ngõ đi chung và quyền thừa kế: Đặc thù nhà đất nội đô Đống Đa là nhiều thế hệ cùng sinh sống, nhà nằm sâu trong ngõ nhỏ ngoằn ngoèo, dễ phát sinh tranh chấp diện tích chung – riêng, tranh chấp ranh giới tường chung với hàng xóm.\nRủi ro quy hoạch mở rộng ngõ và đường chỉ giới đỏ: Dự án đường Vành đai 1 (đoạn Hoàng Cầu – Voi Phục) đang trong giai đoạn hoàn thiện giải tỏa cuối cùng. Nếu nhà đầu tư không kiểm tra kỹ chỉ giới đường đỏ có thể mua phải diện tích nhà bị cắt xén một phần hoặc toàn bộ.',
      '[CHÈN ẢNH: Khung cảnh phố đi bộ và ẩm thực quanh hồ Hoàng Cầu - Ô Chợ Dừa, không gian thoáng đãng, các quán cà phê đông đúc khách hàng vào buổi tối - Alt-text: Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế - Tìm kiếm: site:vnexpress.net + ho hoang cau o cho dua quan dong da]',
      '## 4. Lời khuyên đầu tư: 4 tiêu chí "chọn mặt gửi vàng" tại lõi Đống Đa',
      'Khi tham gia giao dịch bất động sản tại quận Đống Đa trong giai đoạn hiện nay, nhà đầu tư cần tuân thủ 4 tiêu chí cốt lõi:\n1. Ưu tiên bất động sản "ngõ thông – ô tô đỗ cửa": Tuyệt đối hạn chế xuống tiền vào các căn nhà nằm trong ngõ quá sâu (dưới 1,5m), xe máy tránh nhau khó khăn và cách đường lớn trên 100m. Những căn nhà này dù có đơn giá mét vuông rẻ hơn nhưng biên độ tăng giá rất chậm và tiềm ẩn rủi ro nghiêm trọng về an toàn phòng cháy chữa cháy (PCCC).\n2. Kiểm tra hiện trạng sổ đỏ và đối chiếu thực địa: Yêu cầu bên bán cung cấp trích lục bản đồ địa chính mới nhất. Thuê đơn vị đo đạc độc lập bắn tọa độ mốc giới để đảm bảo diện tích đất thực tế khớp 100% với diện tích ghi trên Giấy chứng nhận quyền sử dụng đất.\n3. Mô hình đầu tư cải tạo tạo dòng tiền (Value-Add Strategy): Lựa chọn mua những căn nhà cũ nát có vị trí ngõ đẹp tại Láng Hạ, Ô Chợ Dừa hoặc Cát Linh, sau đó đập đi xây mới thành tòa nhà 6 – 7 tầng có thang máy để vận hành mô hình căn hộ dịch vụ cao cấp (Studio/Duplex). Mô hình này giúp nâng tỷ suất sinh lời dòng tiền từ mức 3,5% lên tới 6,5% – 7,2%/năm.\n4. Cân đối dòng tiền thanh toán: Giá trị nhà đất Đống Đa rất lớn (thường từ 8 – 25 tỷ đồng/căn). Nhà đầu tư cần có sẵn tối thiểu 60% vốn tự có, chỉ nên sử dụng vốn vay tối đa 40% và nguồn thu từ lương/kinh doanh hàng tháng phải đủ chi trả gấp 1,5 lần nghĩa vụ nợ ngân hàng.',
      'Nguồn tham khảo: Dữ liệu phân tích Batdongsan.com.vn, Báo cáo Nghiên cứu Thị trường CBRE Việt Nam và Hệ thống Công chứng Tư pháp Hà Nội.'
    ]
  },
  {
    id: 'vanh-dai-4-ha-noi-dinh-vi-dong-tien-ven-do-2026',
    title: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô',
    summary: 'Định vị các vùng trũng giá và cơ hội giải ngân dòng vốn đầu tư bất động sản ven đô Hà Nội theo tiến độ hoàn thiện của đại dự án Vành đai 4 Vùng Thủ đô.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=1200&auto=format&fit=crop&q=80',
    date: '22/09/2026',
    author: 'TS. KTS. Lê Văn Tuấn – Chuyên gia Viện Quy hoạch Đô thị & Nông thôn Quốc gia',
    readTime: '10 phút đọc',
    views: 3950,
    featured: false,
    tags: ['Quy hoạch Vành đai 4 Hà Nội', 'Bất động sản ven đô Hà Nội', 'Đất nền Hoài Đức', 'Đầu tư đất Đan Phượng', 'Quy hoạch vùng Thủ đô'],
    content: [
      'Được mệnh danh là "dự án thế kỷ" của Vùng kinh tế trọng điểm Bắc Bộ, tuyến đường Vành đai 4 – Vùng Thủ đô Hà Nội bước vào quý III/2026 với khí thế thi công khẩn trương trên toàn bộ các gói thầu xây lắp độc lập. Không đơn thuần là một công trình giao thông đối ngoại giải tỏa áp lực xuyên tâm cho các tuyến Vành đai 3 và cầu Thanh Trì, Vành đai 4 mang sứ mệnh lịch sử là trục xương sống định hình lại toàn bộ cấu trúc phân bổ dân cư, công nghiệp và chuỗi dịch vụ logistics cho cả ba tỉnh thành: Hà Nội, Hưng Yên và Bắc Ninh.',
      'Chính sự hình thành của đại lộ vành đai liên vùng đã mở toang cánh cửa phát triển cho các huyện ngoại thành phía Tây và phía Bắc Thủ đô, tạo nên một cuộc chuyển dịch dòng vốn đầu tư quy mô lớn nhất trong vòng một thập kỷ qua từ khu vực nội đô chật chội ra các cực tăng trưởng đô thị vệ tinh ven đô.',
      '[CHÈN ẢNH: Công trường thi công trải thảm nhựa đại lộ song hành đường Vành đai 4 đoạn qua Hoài Đức - Đan Phượng và trụ tháp cầu Hồng Hà vượt sông Hồng - Alt-text: Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô - Tìm kiếm: site:vnexpress.net + cong truong thi cong duong song hanh vanh dai 4 ha noi]',
      '## 1. Bối cảnh & Số liệu: Tiến độ giải ngân và sự dịch chuyển mặt bằng giá đất ven đô',
      'Theo báo cáo cập nhật tiến độ từ Ban Quản lý Dự án Đầu tư Xây dựng Công trình Giao thông TP. Hà Nội và số liệu thống kê giao dịch bất động sản của CafeF tính đến tháng 9/2026:\n• Quy mô và tiến độ kỹ thuật: Dự án có tổng chiều dài 112,8 km (đoạn qua Hà Nội dài 58,2 km; Hưng Yên dài 19,3 km; Bắc Ninh dài 25,6 km và tuyến nối 9,7 km). Công tác giải phóng mặt bằng trên địa bàn Hà Nội đã hoàn thành 99,2%; phần đường song hành hai bên đã cơ bản thảm nhựa bê tông các đoạn ưu tiên; các cầu lớn vượt sông Hồng (cầu Hồng Hà, cầu Mễ Sở) đang đẩy nhanh tiến độ thi công trụ tháp ngầm.\n• Huyện Hoài Đức: Giá đất thổ cư tại các xã nằm liền kề nút giao Vành đai 4 (Đắc Sở, Tiền Yên, Song Phương) đã tăng từ mức 38 – 52 triệu đồng/m² năm 2024 lên ngưỡng 65 – 92 triệu đồng/m² năm 2026 (tăng 68% sau hơn 2 năm). Đất dịch vụ phân lô hoàn chỉnh hạ tầng đạt từ 95 – 125 triệu đồng/m².\n• Huyện Đan Phượng: Khu vực xã Tân Hội, Liên Hà tiếp giáp đại lộ Tây Thăng Long và Vành đai 4 ghi nhận mức giá giao dịch từ 55 – 82 triệu đồng/m², tăng bình quân 54%.\n• Huyện Mê Linh: Đất nền các khu đô thị lớn (Thanh Lâm – Đại Thịnh, Tiền Phong) tăng từ 28 – 36 triệu đồng/m² lên ngưỡng 42 – 60 triệu đồng/m², tăng trưởng 46%.\n• Huyện Thanh Oai & Thường Tín: Các trục kết nối vào quốc lộ 21B và cao tốc Pháp Vân ghi nhận mức tăng từ 24 – 32 triệu đồng/m² lên 38 – 55 triệu đồng/m².\n• Thanh khoản thị trường: Khối lượng giao dịch đất thổ cư có sổ đỏ trong bán kính 2km quanh các nút giao liên thông của Vành đai 4 tăng trưởng 42% so với cùng kỳ năm 2025, phản ánh dòng tiền đang đổ mạnh về đón đầu thời điểm thông xe toàn tuyến dự kiến vào cuối năm 2027.',
      '[CHÈN ẢNH: Sơ đồ đồ họa bản đồ hướng tuyến Vành đai 4 Vùng Thủ đô, đánh dấu chi tiết các nút giao liên thông khác mức (Interchange) và các điểm giao cắt với Đại lộ Thăng Long, QL32, QL6, Cao tốc Hà Nội - Hải Phòng - Alt-text: Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô - Tìm kiếm: site:vnexpress.net + so do nut giao vanh dai 4 ha noi do hoa]',
      '## 2. Phân tích Luật & Quy hoạch: Hành lang pháp lý đặc thù và quy hoạch đô thị vệ tinh',
      'Dự án Vành đai 4 đạt được tốc độ triển khai kỷ lục nhờ nền tảng pháp lý vững chắc và quy hoạch bài bản:\nDự án được Quốc hội phê duyệt chủ trương đầu tư tại Nghị quyết số 56/2022/QH15 với cơ chế đặc thù cho phép chỉ định thầu các gói thầu tư vấn, di dời hạ tầng kỹ thuật và khai thác trực tiếp các mỏ vật liệu xây dựng (đất đắp, cát san lấp) nằm trong quy hoạch mà không phải qua quy trình đấu giá phức tạp. Cơ chế này giúp loại bỏ rủi ro thiếu hụt nguồn nguyên vật liệu – nguyên nhân từng làm đình trệ hàng loạt đại dự án cao tốc trước đây.',
      'Căn cứ Nghị quyết số 15-NQ/TW của Bộ Chính trị về phương hướng, nhiệm vụ phát triển Thủ đô Hà Nội đến năm 2030, tầm nhìn đến năm 2045: Vành đai 4 là ranh giới phân định vùng đô thị trung tâm mở rộng và chuỗi các đô thị vệ tinh sinh thái. Dọc theo hành lang Vành đai 4, Hà Nội quy hoạch hàng loạt phân khu chức năng cao cấp: Khu công nghệ cao sinh học Hòa Lạc mở rộng, các cụm logistics tập trung tại Thanh Oai và Sóc Sơn, và lộ trình nâng cấp lên quận của huyện Hoài Đức và Đan Phượng gắn liền với tiến độ hoàn thành các tuyến đường gom kết nối trực tiếp vào Vành đai 4.',
      '## 3. Đánh giá chuyên gia: Nhận diện cơ hội gia tăng giá vốn và các cạm bẫy rủi ro',
      'Dưới góc nhìn của một chuyên gia phân tích đầu tư độc lập, đất ven Vành đai 4 hiện tại đang ở chu kỳ tăng trưởng giá trị thực, nhưng ranh giới giữa thành công và thất bại phụ thuộc vào việc nhận diện rủi ro:\nCơ hội vàng cho nhà đầu tư trung và dài hạn: Hiệu ứng rút ngắn khoảng cách thời gian: Khi cao tốc hoàn thành, thời gian di chuyển từ Hoài Đức, Đan Phượng sang trung tâm hành chính Mỹ Đình chỉ còn khoảng 15 – 20 phút; từ Mê Linh sang sân bay Nội Bài chỉ còn 10 phút. Khoảng cách địa lý bị xóa nhòa bởi tốc độ lưu thông, tạo ra sự cân bằng về mặt bằng giá giữa nội thành và ven đô. So với mức giá trên 250 triệu đồng/m² của đất ven Vành đai 3 (đoạn Nguyễn Xiển, Khuất Duy Tiến), mức giá 60 – 90 triệu đồng/m² ven Vành đai 4 hiện vẫn ở "vùng trũng", hứa hẹn biên độ tăng trưởng tối thiểu 50% – 80% trong chu kỳ 3 – 5 năm tới.',
      'Cảnh báo các cạm bẫy rủi ro chí mạng:\nBẫy đất nông nghiệp phân lô và giấy tờ viết tay: Nhiều nhà đầu tư ham rẻ đã đổ tiền mua đất trồng cây lâu năm, đất nông nghiệp xen kẹt với lời hứa "chờ chuyển đổi sang đất ở". Đây là rủi ro cực lớn bởi theo Luật Đất đai 2024, việc chuyển đổi mục đích sử dụng đất bị kiểm soát vô cùng ngặt nghèo và đơn giá chuyển đổi theo bảng giá đất mới sẽ triệt tiêu hoàn toàn lợi nhuận dự kiến.\nRủi ro dính hành lang cách ly và chỉ giới đỏ công trình phụ trợ: Đường cao tốc Vành đai 4 có hành lang an toàn đường bộ và dải cây xanh cách ly rộng từ 50m – 100m. Mua phải đất nằm trong phạm vi giải tỏa phụ trợ hoặc đất không có đường gom kết nối sẽ rơi vào cảnh "nhìn thấy cao tốc nhưng không thể đi vào", tài sản bị cô lập và mất tính thanh khoản.',
      '[CHÈN ẢNH: Khu đô thị sinh thái kiểu mẫu mới khang trang tại Hoài Đức với các dãy nhà phố biệt thự đồng bộ, công viên hồ nước và hạ tầng điện đường hoàn chỉnh - Alt-text: Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô - Tìm kiếm: site:vnexpress.net + khu do thi hoai duc dan phuong vanh dai 4]',
      '## 4. Lời khuyên đầu tư: Nguyên tắc "3 Có - 3 Tránh" khi giải ngân ven Vành đai 4',
      'Để định vị dòng tiền chuẩn xác và tối đa hóa tỷ suất sinh lời khi đầu tư bám theo Vành đai 4, nhà đầu tư cần khắc cốt ghi tâm nguyên tắc vàng:\n3 NGUYÊN TẮC "CÓ" (Bắt buộc phải tuân thủ):\n1. Có sổ đỏ thổ cư 100% (Đất ở tại nông thôn ONT hoặc đất ở đô thị ODT): Pháp lý phải sạch tuyệt đối, không có tranh chấp, không nằm trong diện kê biên thi hành án.\n2. Có vị trí nằm trong "Bán kính vàng 1km – 3km" từ các nút giao liên thông: Đường cao tốc trên cao chỉ cho phép xe lên xuống tại các nút giao khác mức (Interchange). Do đó, chỉ những khu đất kết nối thuận tiện vào các đường gom dẫn tới nút giao mới được hưởng trọn vẹn giá trị gia tăng hạ tầng.\n3. Có đường trước nhà rộng tối thiểu 4,5m (Ô tô tránh nhau và thông hai đầu): Đất trong ngõ cụt hoặc ngõ ngách xe máy sẽ không hưởng lợi từ làn sóng di dân và kinh doanh thương mại ven vành đai.\n\n3 NGUYÊN TẮC "TRÁNH" (Tuyệt đối không vi phạm):\n1. Tránh đất nằm sát mép cao tốc không có đường gom: Tiếng ồn, bụi mịn và rào chắn cao tốc sẽ biến bất động sản thành khu vực ô nhiễm, khó ở và khó kinh doanh.\n2. Tránh sử dụng đòn bẩy tài chính ngắn hạn (Dưới 3 năm): Các đại dự án hạ tầng kỹ thuật quy mô lớn luôn có độ trễ nhất định về thời gian kết nối hoàn chỉnh các nhánh phụ. Nhà đầu tư phải chuẩn bị nguồn vốn dài hạn với tầm nhìn từ 3 đến 5 năm để gặt hái biên lợi nhuận cao nhất.\n3. Tránh mua theo tin đồn quy hoạch miệng của môi giới địa phương: Luôn yêu cầu kiểm tra đối chiếu tọa độ thửa đất trên hệ thống Bản đồ số Quy hoạch sử dụng đất cấp huyện đã được UBND Thành phố Hà Nội phê duyệt công khai.',
      'Nguồn tham khảo: Báo điện tử VnExpress, Báo Đầu tư, Báo cáo Nghiên cứu Hạ tầng Đô thị Savills Việt Nam và Ban Quản lý Dự án Giao thông TP. Hà Nội.'
    ]
  },
  {
    id: 'lai-suat-ngan-hang-giam-bds',
    title: 'Lãi suất vay mua nhà giảm sâu: Thời điểm thích hợp để sở hữu bất động sản an cư?',
    summary: 'Các gói tín dụng ưu đãi từ 5.5% - 6.5%/năm đang kích hoạt dòng vốn cá nhân quay trở lại phân khúc chung cư cao cấp và nhà riêng thổ cư nội đô.',
    category: 'investment',
    categoryLabel: 'Tài chính & Đầu tư',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
    date: '15/09/2025',
    author: 'Chuyên gia Tài chính Techcombank',
    readTime: '6 phút đọc',
    views: 1670,
    tags: ['Lãi suất mua nhà', 'Đòn bẩy tài chính', 'Đầu tư an cư'],
    content: [
      'Mặt bằng lãi suất vay mua nhà ở mức thấp nhất trong 5 năm qua đang tạo ra cơ hội tối ưu chi phí vốn cho người có nhu cầu ở thực và đầu tư tích sản dài hạn.',
      'Người mua nhà cần cân nhắc kỹ dòng tiền thu nhập ổn định hàng tháng để tỷ lệ trả nợ không vượt quá 40-50% tổng thu nhập gia đình.'
    ]
  },
  {
    id: 'quy-hoach-song-hong-ha-noi',
    title: 'Phân khu đô thị Sông Hồng: Diện mạo trục không gian xanh và cảnh quan trung tâm Thủ đô',
    summary: 'Đồ án quy hoạch phân khu đô thị sông Hồng được đẩy mạnh tiến độ, hình thành trục cảnh quan sinh thái văn hóa kết hợp thương mại dịch vụ hiện đại ven sông.',
    category: 'project',
    categoryLabel: 'Dự án & Quy hoạch',
    categoryColor: 'bg-teal-600 text-white',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80',
    date: '11/09/2025',
    author: 'Viện Quy hoạch Xây dựng Hà Nội',
    readTime: '9 phút đọc',
    views: 3100,
    tags: ['Sông Hồng', 'Trục cảnh quan', 'Tây Hồ', 'Long Biên'],
    content: [
      'Trục sông Hồng sẽ trở thành biểu tượng mới của Hà Nội năng động, cân bằng giữa bảo tồn di sản sông nước và kiến tạo không gian sống sinh thái chuẩn quốc tế.',
      'Quy hoạch phân định rõ hành lang thoát lũ và khu vực phát triển đô thị xanh thông minh hai bên bờ.'
    ]
  },
  {
    id: 'chung-cu-ha-noi-thiet-lap-mat-bang-gia-moi',
    title: 'Chung cư Hà Nội thiết lập mặt bằng giá mới: Xu hướng dòng tiền dịch chuyển về phía Tây',
    summary: 'Nguồn cung sơ cấp hạn chế cùng hạ tầng kết nối phía Tây hoàn thiện đang khiến các dự án căn hộ cao cấp khu vực Nam Từ Liêm và Cầu Giấy hút mạnh dòng tiền.',
    category: 'pricing',
    categoryLabel: 'Biến động giá đất',
    categoryColor: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&auto=format&fit=crop&q=80',
    date: '08/09/2025',
    author: 'Nguyễn Minh Quân - Chuyên gia BĐS',
    readTime: '6 phút đọc',
    views: 2450,
    tags: ['Chung cư Hà Nội', 'Khu vực phía Tây', 'Thị trường sơ cấp'],
    content: [
      'Báo cáo thị trường quý gần nhất cho thấy tỷ trọng giao dịch căn hộ có tầm giá trên 60 triệu đồng/m² chiếm hơn 70% tổng lượng tiêu thụ tại thị trường Hà Nội.',
      'Các dự án gần các trục vành đai và nhà ga Metro có tốc độ hấp thụ vượt trội so với mức trung bình chung.'
    ]
  },
  {
    id: 'cau-tran-hung-dao-ha-noi-khoi-cong',
    title: 'Quy hoạch cầu Trần Hưng Đạo: Đòn bẩy hạ tầng thúc đẩy giá trị BĐS bờ Đông sông Hồng',
    summary: 'Cây cầu biểu tượng nối trung tâm quận Hoàn Kiếm sang quận Long Biên mở ra chu kỳ phát triển mới cho phân khúc biệt thự, shophouse và đất nền phía Đông.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    date: '03/09/2025',
    author: 'Ban Quy hoạch & Đô thị',
    readTime: '7 phút đọc',
    views: 2780,
    tags: ['Cầu Trần Hưng Đạo', 'Long Biên', 'Quy hoạch giao thông'],
    content: [
      'Dự án không chỉ giảm tải cho cầu Chương Dương và cầu Vĩnh Tuy mà còn kết nối liền mạch hành lang kinh tế nội đô với các đô thị sinh thái hiện đại.',
      'Sự xuất hiện của cây cầu kiến trúc cánh buồm độc đáo hứa hẹn tạo cú hích lớn cho giá trị bất động sản toàn dải ven bờ Đông.'
    ]
  },
  {
    id: 'fdi-kieu-hoi-bds-thu-do-2025',
    title: 'Dòng vốn FDI và kiều hối đổ mạnh vào bất động sản Thủ đô dịp cuối năm',
    summary: 'Hà Nội liên tục dẫn đầu cả nước về thu hút vốn đầu tư nước ngoài vào lĩnh vực bất động sản công nghiệp, văn phòng hạng A và căn hộ dịch vụ cao cấp.',
    category: 'investment',
    categoryLabel: 'Tài chính & Đầu tư',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    date: '30/08/2025',
    author: 'Vũ Thanh Tùng - Chuyên viên Đầu tư',
    readTime: '5 phút đọc',
    views: 1980,
    tags: ['FDI Hà Nội', 'Dòng tiền ngoại', 'Bất động sản cao cấp'],
    content: [
      'Môi trường kinh doanh ổn định và cơ chế mở theo Luật Thủ đô mới đang gia tăng sức hấp dẫn mạnh mẽ cho các nhà đầu tư tổ chức quốc tế.',
      'Dòng kiều hối chuyển về Việt Nam trong quý cuối năm đạt mức cao, trong đó tỷ lệ giải ngân vào bất động sản an cư và cho thuê chiếm trên 25%.'
    ]
  },
  {
    id: 'dong-anh-me-linh-quy-hoach-thanh-pho-bac-song-hong',
    title: 'Quy hoạch trục đô thị Bắc sông Hồng: Đông Anh và Mê Linh hướng tới mô hình thành phố thông minh',
    summary: 'Đồ án quy hoạch chung xây dựng Thủ đô xác định khu vực phía Bắc sông Hồng sẽ trở thành trung tâm dịch vụ tài chính, thương mại giao thương quốc tế mới.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    date: '28/08/2025',
    author: 'KTS. Lê Quang Minh',
    readTime: '6 phút đọc',
    views: 2640,
    tags: ['Đông Anh', 'Mê Linh', 'Bắc Sông Hồng', 'Quy hoạch 2045'],
    content: [
      'Với quy mô hàng nghìn hecta quỹ đất sạch cùng trục giao thông cầu Nhật Tân - sân bay Nội Bài, khu vực phía Bắc đang đón đầu các đại dự án thành phố thông minh và trung tâm hội chợ triển lãm quốc gia.',
      'Hạ tầng đồng bộ gồm đường Võ Nguyên Giáp và tuyến Metro số 2 mở rộng sẽ rút ngắn thời gian di chuyển về trung tâm chỉ còn 15-20 phút.'
    ]
  },
  {
    id: 'gia-thue-mat-bang-pho-co-ha-noi-2026',
    title: 'Thị trường mặt bằng bán lẻ phố cổ Hà Nội: Giá thuê phục hồi 95% thời kỳ hoàng kim',
    summary: 'Sự bùng nổ của du lịch quốc tế và các chuỗi F&B cao cấp giúp tỷ lệ lấp đầy các căn nhà phố thương mại Hoàn Kiếm và Ba Đình đạt mức cao kỷ lục.',
    category: 'pricing',
    categoryLabel: 'Biến động giá đất',
    categoryColor: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    date: '25/08/2025',
    author: 'Ban Nghiên cứu Thị trường',
    readTime: '4 phút đọc',
    views: 3120,
    tags: ['Mặt bằng phố cổ', 'Hoàn Kiếm', 'Giá thuê shophouse', 'BĐS thương mại'],
    content: [
      'Ghi nhận tại các tuyến phố Hàng Bông, Tràng Tiền, Cầu Gỗ, giá thuê mặt bằng tầng 1 diện tích 40-70m² hiện dao động từ 120 đến 250 triệu đồng/tháng.',
      'Sự gia tăng chi tiêu từ du khách nước ngoài đang thúc đẩy nhu cầu tìm kiếm các vị trí đắc địa kinh doanh ẩm thực và lưu niệm cao cấp.'
    ]
  },
  {
    id: 'do-thi-ve-tinh-hoa-lac-dau-tu-ha-tang',
    title: 'Đô thị vệ tinh Hòa Lạc: Đẩy mạnh giải ngân vốn đầu tư công và hạ tầng công nghệ cao',
    summary: 'Quy hoạch mở rộng Đại lộ Thăng Long kéo dài kết nối Hòa Bình cùng mạng lưới xe buýt nhanh BRT đang rút ngắn thời gian di chuyển từ trung tâm Hà Nội về Hòa Lạc.',
    category: 'project',
    categoryLabel: 'Dự án & Quy hoạch',
    categoryColor: 'bg-teal-600 text-white',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    date: '22/08/2025',
    author: 'ThS. Nguyễn Hoàng Nam',
    readTime: '7 phút đọc',
    views: 2150,
    tags: ['Hòa Lạc', 'Đô thị vệ tinh', 'Công nghệ cao', 'Đại lộ Thăng Long'],
    content: [
      'Hòa Lạc đang chuyển mình mạnh mẽ với sự dịch chuyển của các trường đại học lớn và trung tâm dữ liệu AI của các tập đoàn công nghệ hàng đầu.',
      'Hạ tầng giao thông kết nối hoàn chỉnh sẽ biến Hòa Lạc thành cực phát triển kinh tế tri thức và công nghệ của cả miền Bắc.'
    ]
  },
  {
    id: 'dong-tien-nha-dau-tu-tay-ha-noi-2026',
    title: 'Dòng tiền dịch chuyển về phía Tây Hà Nội: Lợi thế từ hạ tầng giao thông đa tầng',
    summary: 'Hệ thống hầm chui Lê Văn Lương, đường Vành đai 3 trên cao và tuyến Metro Nhổn - Ga Hà Nội vận hành thương mại giúp thanh khoản căn hộ khu Tây tăng vượt bậc.',
    category: 'investment',
    categoryLabel: 'Tài chính & Đầu tư',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
    date: '18/08/2025',
    author: 'Chuyên gia Đầu tư BĐS',
    readTime: '5 phút đọc',
    views: 2890,
    tags: ['Khu vực phía Tây', 'Thanh khoản căn hộ', 'Metro Nhổn - Ga Hà Nội'],
    content: [
      'Hạ tầng đồng bộ biến khu vực Mỹ Đình - Cầu Giấy thành trung tâm tài chính và thương mại năng động bậc nhất Thủ đô.',
      'Khảo sát giá chuyển nhượng căn hộ khu Tây cho thấy mức tăng bình quân 15-20% trong vòng 12 tháng qua.'
    ]
  },
  {
    id: 'quy-hoach-san-bay-thu-2-ha-noi-nam-phu-xuyen',
    title: 'Quy hoạch sân bay thứ 2 Vùng Thủ đô tại phía Nam: Động lực bứt phá cho Phú Xuyên - Ứng Hòa',
    summary: 'Phương án bố trí cảng hàng không quốc tế thứ 2 với công suất 50 triệu khách/năm mở ra triển vọng hình thành cực tăng trưởng công nghiệp và logistics phía Nam.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&auto=format&fit=crop&q=80',
    date: '15/08/2025',
    author: 'Viện Quy hoạch Xây dựng Hà Nội',
    readTime: '8 phút đọc',
    views: 3500,
    tags: ['Sân bay thứ 2', 'Phú Xuyên', 'Ứng Hòa', 'Quy hoạch vùng Thủ đô'],
    content: [
      'Cảng hàng không thứ 2 kết nối cao tốc Pháp Vân - Cầu Giẽ và đường sắt tốc độ cao Bắc - Nam sẽ tạo lực đẩy chuyển dịch cơ cấu kinh tế mạnh mẽ cho các huyện ngoại thành phía Nam.',
      'Khu vực này được định hướng phát triển chuỗi cung ứng logistics hiện đại và các cụm đô thị dịch vụ vệ tinh.'
    ]
  }
];

/**
 * Lấy bài viết theo ID hoặc Slug (hỗ trợ cả bài viết lưu động trong localStorage)
 */
export function getNewsArticleById(id: string): NewsArticle | undefined {
  if (!id) return undefined;
  const decodedId = decodeURIComponent(id).trim().toLowerCase();

  // 1. Tìm trong NEWS_ARTICLES
  const foundInNews = NEWS_ARTICLES.find(
    (a) => a.id.toLowerCase() === decodedId || a.id.toLowerCase() === id.toLowerCase()
  );
  if (foundInNews) return foundInNews;

  // 2. Tìm trong INITIAL_ARTICLES
  const foundInInitial = INITIAL_ARTICLES.find(
    (a) => a.id.toLowerCase() === decodedId || a.slug?.toLowerCase() === decodedId
  );
  if (foundInInitial) {
    return {
      id: foundInInitial.id,
      title: foundInInitial.title,
      summary: foundInInitial.excerpt,
      category: (foundInInitial.category as any) || 'planning',
      categoryLabel: foundInInitial.categoryLabel || 'Tin tức',
      categoryColor: foundInInitial.categoryColor || 'bg-blue-500 text-white',
      image: foundInInitial.featuredImage || getCategoryFallbackImage(foundInInitial.category),
      date: foundInInitial.createdAt ? new Date(foundInInitial.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
      author: foundInInitial.authorName || 'Ban biên tập HaNoi Realty',
      readTime: foundInInitial.readTime || '5 phút đọc',
      views: foundInInitial.views || 300,
      content: [foundInInitial.excerpt, foundInInitial.content.replace(/<[^>]+>/g, ' ')],
      tags: ['Bất động sản', 'Quy hoạch Hà Nội']
    };
  }

  // 3. Tìm trong localStorage client-side (nếu có)
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('hanoi_platform_articles');
      if (raw) {
        const storedList: Article[] = JSON.parse(raw);
        const matchStored = storedList.find(
          (s) => s.id.toLowerCase() === decodedId || s.slug?.toLowerCase() === decodedId
        );
        if (matchStored) {
          return {
            id: matchStored.id,
            title: matchStored.title,
            summary: matchStored.excerpt || '',
            category: (matchStored.category as any) || 'planning',
            categoryLabel: matchStored.categoryLabel || 'Tin tức',
            categoryColor: matchStored.categoryColor || 'bg-blue-500 text-white',
            image: matchStored.featuredImage || getCategoryFallbackImage(matchStored.category),
            date: matchStored.createdAt ? new Date(matchStored.createdAt).toLocaleDateString('vi-VN') : 'Mới cập nhật',
            author: matchStored.authorName || 'Ban biên tập HaNoi Realty',
            readTime: matchStored.readTime || '5 phút đọc',
            views: matchStored.views || 100,
            content: [matchStored.excerpt || '', matchStored.content ? matchStored.content.replace(/<[^>]+>/g, ' ') : ''],
            tags: ['Bất động sản Hà Nội']
          };
        }
      }
    } catch {
      // bỏ qua lỗi parse
    }
  }

  return undefined;
}
