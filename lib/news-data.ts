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
    author: 'Tổng biên tập HaNoi Realty & Ban Phân tích CBRE/Savills',
    readTime: '8 phút đọc',
    views: 5840,
    featured: true,
    tags: ['Giá nhà Hà Nội 2026', 'Luật Đất đai 2024', 'Metro Hà Nội', 'Kịch bản dòng tiền', 'Đầu tư BĐS'],
    content: [
      'Bước sang quý III/2026, thị trường bất động sản Hà Nội đang định hình một chu kỳ phát triển hoàn toàn mới. Sự cộng hưởng từ việc các bộ luật sửa đổi (Luật Đất đai 2024, Luật Nhà ở 2023, Luật Kinh doanh Bất động sản 2023) đi vào vận hành thực tế tròn 2 năm, kết hợp cùng bước nhảy vọt của mạng lưới giao thông đường sắt đô thị (Metro), đã biến năm 2026 thành tâm điểm tái cấu trúc giá trị tài sản trên toàn thành phố.',
      'Theo ghi nhận từ báo cáo tổng hợp của CBRE và Savills Việt Nam quý III/2026, chỉ số giá căn hộ sơ cấp toàn thị trường Hà Nội duy trì mức tăng trung bình 14,2% so với cùng kỳ năm 2025, thiết lập mặt bằng giá mới dao động từ 75 – 115 triệu đồng/m² tại các quận nội thành mở rộng.',
      '## 1. Áp lực từ bảng giá đất sát thị trường và khung pháp lý mới',
      'Yếu tố cốt lõi chi phối mặt bằng giá nhà ở giai đoạn 2026 chính là việc chính thức áp dụng bảng giá đất mới hàng năm theo nguyên tắc thị trường, xóa bỏ hoàn toàn cơ chế khung giá đất cũ.',
      'Chi phí đền bù giải phóng mặt bằng tăng từ 35% – 50% tại nhiều địa bàn trọng điểm đã trực tiếp đẩy chi phí vốn đầu vào (input costs) của các chủ đầu tư lên ngưỡng cao chưa từng thấy. Các dự án mới ra mắt trong năm 2026 gần như triệt tiêu phân khúc căn hộ bình dân dưới 40 triệu đồng/m²; thay vào đó, giỏ hàng sơ cấp tập trung 85% ở phân khúc cao cấp và hạng sang.',
      'Bên cạnh đó, việc siết chặt điều kiện huy động vốn và nghĩa vụ bảo lãnh tài chính giúp thanh lọc thị trường triệt để. Những dự án sở hữu pháp lý sạch, minh bạch quyền sử dụng đất và được cấp phép xây dựng trở thành tài sản phòng thủ chiến lược, được giới đầu tư săn đón dù biên độ chiết khấu không còn sâu như các chu kỳ trước.',
      '## 2. Hạ tầng Metro và Vành đai: Xương sống định hình mặt bằng giá mới',
      'Nếu như giai đoạn 2020 – 2023 giá đất chủ yếu tăng theo các "cơn sốt tin đồn", thì bước sang năm 2026, giá trị bất động sản tăng trưởng thực chất theo tiến độ giải ngân đầu tư công.',
      'Mạng lưới đường sắt đô thị Hà Nội đã phát huy vai trò xương sống với tuyến Metro số 2A (Cát Linh - Hà Đông) khai thác ổn định, tuyến Metro số 3 (đoạn Nhổn - Ga Hà Nội) vận hành toàn diện và tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo) tăng tốc thi công vượt mốc kế hoạch. Dữ liệu từ Batdongsan.com.vn cho thấy, trong bán kính 500m – 800m quanh các nhà ga Metro, giá bất động sản thứ cấp và giá thuê căn hộ ghi nhận mức thặng dư trung bình cao hơn từ 18% đến 22% so với mặt bằng chung cùng khu vực.',
      'Song song đó, trục đại lộ Vành đai 4 kết nối liên vùng đang hoàn tất các phân đoạn kỹ thuật, kéo theo làn sóng ly tâm dòng tiền mạnh mẽ về các đô thị vệ tinh tại Hoài Đức, Gia Lâm, Đông Anh và Thanh Oai.',
      '## 3. Kịch bản phân bổ dòng tiền: Sự dịch chuyển sang tài sản tạo dòng tiền thực',
      'Khảo sát tâm lý nhà đầu tư quý III/2026 chỉ ra sự chuyển biến căn bản: "Đầu cơ lướt sóng bằng đòn bẩy tài chính cao" đã nhường chỗ cho "Tích sản tạo dòng tiền hữu hình (Yield-driven Assets)".',
      'Ba kịch bản phân bổ dòng tiền chủ đạo đang dẫn dắt thị trường:\n• Kịch bản 1 - Bất động sản lõi nội đô cho thuê: Dòng tiền tổ chức và gia đình tiếp tục dồn vào chung cư trung tâm và nhà phố kinh doanh tại các quận Đống Đa, Cầu Giấy, Ba Đình nhờ tỷ suất sinh lời cho thuê (Rental Yield) đạt ngưỡng 5,2% – 5,8%/năm, vượt mức lãi suất tiền gửi danh nghĩa.\n• Kịch bản 2 - Nhà phố đô thị tích hợp ven vành đai: Thu hút giới đầu tư trung và dài hạn với tầm nhìn 3 - 5 năm, nơi các đại dự án có đầy đủ tiện ích trường học, y tế, thương mại và hạ tầng kết nối trực tiếp vào nội đô.\n• Kịch bản 3 - Đất nền pháp lý sổ đỏ vùng vệ tinh: Dòng vốn thận trọng hơn, chỉ tập trung giải ngân vào đất thổ cư có sổ đỏ liền kề các khu công nghệ cao Hòa Lạc hoặc nút giao Vành đai 4, loại bỏ hoàn toàn các loại hình đất nông nghiệp phân lô không rõ quy hoạch.',
      '## 4. Kết luận & Khuyến nghị chiến lược',
      'Thị trường bất động sản Hà Nội năm 2026 không dành cho những toan tính ngắn hạn. Xu hướng tăng giá nhà được bảo chứng bởi chi phí phát triển dự án tăng cao và tốc độ đô thị hóa thực tế, song mức độ thanh khoản sẽ phân hóa sâu sắc theo chất lượng hạ tầng và pháp lý dự án.',
      '> Khuyến nghị: Nhà đầu tư cần duy trì tỷ trọng đòn bẩy tín dụng dưới 40%, ưu tiên các dự án sở hữu chứng chỉ quy hoạch rõ ràng và có khả năng sinh dòng tiền ngay.',
      'Bạn đang tìm kiếm danh mục bất động sản an toàn pháp lý và tối ưu lợi suất cho thuê tại Hà Nội? Hãy sử dụng hệ thống tra cứu quy hoạch chi tiết 2030 - 2045 và công cụ định giá AI độc quyền tại HaNoi Realty ngay hôm nay.',
      'Nguồn tham khảo: Báo điện tử VnExpress, CafeF và Báo cáo Nghiên cứu Thị trường CBRE/Savills Việt Nam.'
    ]
  },
  {
    id: 'metro-line-2-hanoi-gia-nha-pho-tang-12-phan-tram',
    title: 'Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công',
    summary: 'Bất động sản nhà phố trung tâm Hà Nội tăng trưởng 12% giá trị sau khi dự án đường sắt đô thị Metro Tuyến số 2 Nam Thăng Long - Trần Hưng Đạo đẩy nhanh tiến độ.',
    category: 'planning',
    categoryLabel: 'Quy hoạch',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    date: '26/09/2026',
    author: 'ThS. Nguyễn Hoàng Nam',
    readTime: '4 phút đọc',
    views: 4120,
    featured: false,
    tags: ['Metro Tuyến số 2', 'Nhà phố Hà Nội', 'Quy hoạch đường sắt đô thị', 'Tây Hồ Tây'],
    content: [
      'Thông tin Ban Quản lý Đường sắt đô thị Hà Nội chính thức đẩy nhanh tiến độ thi công toàn diện tuyến Metro số 2 (Nam Thăng Long – Trần Hưng Đạo) trong quý III/2026 đã lập tức tạo xung lực mạnh mẽ lên thị trường bất động sản khu vực trung tâm và Tây Bắc Thủ đô.',
      'Ghi nhận thực tế từ các sàn giao dịch, giá trị nhà phố mặt tiền và liền kề dọc hành lang tuyến (đặc biệt qua các trục Hoàng Hoa Thám, Thụy Khuê, Phan Đình Phùng và cụm đô thị Nam Thăng Long - Ciputra) đã thiết lập mức tăng bình quân 10% – 12% so với đầu năm 2026. Mức giá giao dịch nhà mặt phố hiện đã chạm ngưỡng 420 – 680 triệu đồng/m² tùy vị trí.',
      'Tuyến Metro số 2 dài 11,5 km với 7 ga ngầm và 3 ga trên cao, đóng vai trò kết nối trực tiếp lõi di sản Hoàn Kiếm với khu đô thị mới Tây Hồ Tây. Các chuyên gia nhận định, lợi thế rút ngắn thời gian di chuyển vào trung tâm tài chính xuống dưới 15 phút là nguyên nhân khiến biên độ tăng giá của nhà phố quanh bán kính 600m của các nhà ga ngầm duy trì tốc độ hấp thụ vượt trội, bất chấp xu hướng hạ nhiệt chung của phân khúc đất nền tự do.',
      'Nguồn tham khảo: Báo điện tử CafeF và Báo Giao thông.'
    ]
  },
  {
    id: 'top-5-phuong-gia-dat-tang-manh-nhat-dong-da-2026',
    title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế',
    summary: 'Số liệu chi tiết top 5 phường có tốc độ tăng trưởng giá đất và thanh khoản dẫn đầu quận Đống Đa năm 2026: Ô Chợ Dừa, Láng Hạ, Cát Linh, Trung Tự, Nam Đồng.',
    category: 'analysis',
    categoryLabel: 'Phân tích BĐS',
    categoryColor: 'bg-purple-600 text-white',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    date: '24/09/2026',
    author: 'Phòng Nghiên cứu Thị trường HaNoi Realty',
    readTime: '4 phút đọc',
    views: 3650,
    featured: false,
    tags: ['Giá đất quận Đống Đa', 'Nhà đất Ô Chợ Dừa', 'Đất Láng Hạ 2026', 'Bất động sản nội đô'],
    content: [
      'Theo dữ liệu lớn (Big Data) tổng hợp đến tháng 9/2026, quận Đống Đa tiếp tục giữ vị thế quán quân về thanh khoản và tỷ suất khai thác thương mại tại vùng lõi Hà Nội. Dưới đây là 5 phường ghi nhận mức tăng trưởng giá đất và giá nhà ở cao nhất trong 12 tháng qua:',
      '1. Phường Ô Chợ Dừa (Tăng 15,8%): Dẫn đầu bảng xếp hạng nhờ hưởng lợi từ nút giao thông Hoàng Cầu - Xã Đàn và tuyến kết nối Yên Lãng. Giá nhà đất trong ngõ ôtô tránh nhau đã vượt mốc 250 – 310 triệu đồng/m²; mặt phố kinh doanh đạt từ 500 – 650 triệu đồng/m².',
      '2. Phường Láng Hạ (Tăng 13,4%): "Phố Wall của Hà Nội" thu hút mạnh dòng tiền đầu tư văn phòng tư nhân và căn hộ dịch vụ cao cấp, duy trì tỷ suất lấp đầy phòng thuê trên 92%.',
      '3. Phường Cát Linh (Tăng 12,9%): Lợi thế kết nối liên tuyến giữa Metro Cát Linh - Hà Đông và Metro Nhổn - Ga Hà Nội đã biến khu vực này thành trung tâm trung chuyển hành khách lớn nhất Thủ đô, kích thích giá thuê mặt bằng bán lẻ tăng vọt.',
      '4. Phường Trung Tự (Tăng 11,2%): Động lực từ tiến độ triển khai quy hoạch cải tạo, xây dựng lại các khu tập thể cũ đã thúc đẩy giá trị thứ cấp của đất thổ cư liền kề.',
      '5. Phường Nam Đồng (Tăng 10,6%): Không gian sống yên tĩnh kết hợp mạng lưới kinh doanh ẩm thực sầm uất ven hồ Đắc Di tạo nên lực hấp thụ ổn định từ nhóm khách hàng mua ở thực.',
      'Sự khan hiếm tuyệt đối về nguồn cung mới tại lõi Đống Đa là bệ phóng đảm bảo tính thanh khoản và khả năng kháng cự trượt giá vượt bậc của nhóm tài sản này.',
      'Nguồn tham khảo: Dữ liệu phân tích Batdongsan.com.vn và Báo cáo Thị trường CBRE Việt Nam.'
    ]
  },
  {
    id: 'vanh-dai-4-ha-noi-dinh-vi-dong-tien-ven-do-2026',
    title: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô',
    summary: 'Định vị các vùng trũng giá và cơ hội giải ngân dòng vốn đầu tư bất động sản ven đô Hà Nội theo tiến độ hoàn thiện của đại dự án Vành đai 4 Vùng Thủ đô.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?w=800&auto=format&fit=crop&q=80',
    date: '22/09/2026',
    author: 'Hội đồng Chuyên gia BĐS Thủ đô',
    readTime: '5 phút đọc',
    views: 3280,
    featured: false,
    tags: ['Vành đai 4 Hà Nội', 'Bất động sản ven đô', 'Đầu tư đất Hoài Đức', 'Quy hoạch Mê Linh'],
    content: [
      'Với quy mô hơn 112 km đi qua ba tỉnh thành (Hà Nội, Hưng Yên, Bắc Ninh), tuyến Vành đai 4 – Vùng Thủ đô đang bước vào giai đoạn tăng tốc thi công các gói thầu xây lắp cuối cùng trong năm 2026. Sự hình thành của đại dự án này đang tái cấu trúc bản đồ giá trị đất đai ven đô theo hướng mở rộng không gian phát triển công nghiệp và đô thị sinh thái.',
      'Dòng vốn đầu tư thông minh hiện đang tập trung định vị vào 3 phân vùng trọng điểm:',
      '• Huyện Hoài Đức & Đan Phượng (Phía Tây): Trọng tâm đón sóng lên quận kết hợp trục đại lộ Tây Thăng Long và các nút giao Vành đai 4. Các khu đô thị hoàn chỉnh pháp lý ghi nhận mức độ quan tâm tăng 35% nhờ thời gian kết nối về trung tâm Mỹ Đình rút ngắn xuống còn 20 phút.',
      '• Huyện Mê Linh (Phía Bắc): Vùng đất hưởng lợi kép từ hạ tầng cầu Hồng Hà và sự mở rộng của các cụm công nghiệp công nghệ cao, thu hút nhóm nhà đầu tư tìm kiếm quỹ đất giá còn mềm dao động từ 35 – 55 triệu đồng/m².',
      '• Huyện Thanh Oai & Thường Tín (Phía Nam): Điểm tựa từ các nút giao kết nối vào cao tốc Pháp Vân - Cầu Giẽ, phát triển mạnh các cụm kho bãi logistics và đô thị vệ tinh quy mô vừa.',
      'Chiến lược giải ngân an toàn trong giai đoạn này là tập trung vào sản phẩm đất thổ cư có sổ đỏ nằm trong bán kính 1 – 3 km từ các nút giao Vành đai 4, tránh các khu vực nằm trực tiếp trong ranh giới cắm mốc giải phóng mặt bằng chưa đền bù.',
      'Nguồn tham khảo: Báo điện tử VnExpress và Báo cáo Quy hoạch Đô thị Savills Việt Nam.'
    ]
  },
  {
    id: 'chinh-sach-luat-dat-dai-moi',
    title: 'Luật Đất đai mới và tác động tới bảng giá đất hàng năm tại Hà Nội',
    summary: 'Bỏ khung giá đất cũ và xây dựng bảng giá đất theo nguyên tắc thị trường: Người mua nhà và nhà đầu tư cần chuẩn bị gì để tối ưu chi phí pháp lý và thuế phí?',
    category: 'policy',
    categoryLabel: 'Chính sách & Pháp lý',
    categoryColor: 'bg-blue-600 text-white',
    image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    date: '19/09/2025',
    author: 'Luật sư Trần Văn Hiệp',
    readTime: '7 phút đọc',
    views: 1820,
    tags: ['Luật Đất đai', 'Bảng giá đất', 'Sổ đỏ pháp lý'],
    content: [
      'Quy định mới tạo bước ngoặt minh bạch hóa thị trường, loại bỏ tình trạng hai giá và bảo vệ quyền lợi hợp pháp của người mua bất động sản có pháp lý hoàn chỉnh.',
      'Việc định giá đất sát với giá trị thị trường thực tế sẽ thúc đẩy sự lành mạnh hóa nguồn cung, giảm bớt đầu cơ lướt sóng ngắn hạn.'
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
