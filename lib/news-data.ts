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
    id: 'metro-line-2-hanoi-q4-2025',
    title: 'Thị trường BĐS Hà Nội: Giá nhà phố tăng 12% sau thông tin Metro Line 2 chính thức tăng tốc thi công',
    summary: 'Sự kết nối giữa các trục giao thông hướng tâm và tuyến Metro số 2 (Nam Thăng Long - Trần Hưng Đạo) đang tạo lực đẩy mạnh mẽ cho phân khúc nhà phố trung tâm và ven đô.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80',
    date: '28/09/2025',
    author: 'Ban biên tập HaNoi Realty',
    readTime: '8 phút đọc',
    views: 3420,
    featured: true,
    tags: ['Metro Hà Nội', 'Quy hoạch 2030', 'Nhà phố Đống Đa', 'Hạ tầng giao thông'],
    content: [
      'Tuyến đường sắt đô thị số 2 (đoạn Nam Thăng Long - Trần Hưng Đạo) vừa được phê duyệt điều chỉnh tổng mức đầu tư và phương án giải phóng mặt bằng, tạo nên làn sóng quan tâm đặc biệt từ giới đầu tư bất động sản.',
      'Khảo sát thực tế của hệ thống HaNoi Realty cho thấy, trong bán kính 800m quanh các nhà ga C1 (Xuân Đỉnh), C2 (Ngoại Giao Đoàn), C3 (Tây Hồ Tây) và khu vực trung tâm phố cổ, giá chào bán nhà mặt phố và nhà riêng trong ngõ ô tô đã ghi nhận mức tăng từ 10% đến 14% so với cùng kỳ.',
      'Các chuyên gia định giá nhận định: Việc hoàn thiện mạng lưới giao thông công cộng khối lượng lớn sẽ tái cấu trúc mật độ cư dân và nâng tầm giá trị thương mại cho các trục shophouse, nhà liền kề trên toàn tuyến.'
    ]
  },
  {
    id: 'vanh-dai-4-ha-noi-co-hoi-vang',
    title: 'Quy hoạch Vành đai 4: Cơ hội vàng và định vị dòng tiền cho nhà đầu tư ven đô',
    summary: 'Dự án đường Vành đai 4 - Vùng Thủ đô đang khẩn trương hoàn thành giải phóng mặt bằng, mở rộng không gian phát triển đô thị vệ tinh tại Hoài Đức, Đan Phượng và Hà Đông.',
    category: 'planning',
    categoryLabel: 'Quy hoạch & Hạ tầng',
    categoryColor: 'bg-emerald-500 text-white',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    date: '25/09/2025',
    author: 'ThS. Nguyễn Hoàng Nam',
    readTime: '6 phút đọc',
    views: 2890,
    tags: ['Vành đai 4', 'Đất nền ven đô', 'Hoài Đức', 'Hà Đông'],
    content: [
      'Đại lộ Vành đai 4 dài 112,8km đi qua Hà Nội, Hưng Yên và Bắc Ninh được kỳ vọng sẽ giải quyết nút thắt giao thông liên vùng và thúc đẩy sự hình thành của các đại đô thị xanh hiện đại.',
      'Tuyến đường mở ra không gian kết nối kinh tế thông suốt, tạo đà tăng trưởng mạnh mẽ cho phân khúc đất nền và khu đô thị vệ tinh vùng ven.'
    ]
  },
  {
    id: 'bien-dong-gia-dat-dong-da-2025',
    title: 'Top 5 phường có giá đất tăng mạnh nhất quận Đống Đa: Phân tích số liệu thực tế',
    summary: 'Dữ liệu giao dịch thực tế cho thấy các phường Ô Chợ Dừa, Láng Hạ và Cát Linh tiếp tục dẫn đầu về thanh khoản và tỷ lệ tăng trưởng giá trị bất động sản nhà ở.',
    category: 'pricing',
    categoryLabel: 'Biến động giá đất',
    categoryColor: 'bg-orange-500 text-white',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    date: '22/09/2025',
    author: 'Phòng Nghiên cứu Thị trường',
    readTime: '5 phút đọc',
    views: 2150,
    tags: ['Giá đất Đống Đa', 'Nhà mặt ngõ', 'Phân tích định giá'],
    content: [
      'Với mật độ dân cư cao và hệ thống trường học, bệnh viện hoàn chỉnh, quận Đống Đa luôn là điểm nóng về nhu cầu an cư bền vững và giữ giá an toàn bậc nhất Hà Nội.',
      'Các tuyến phố huyết mạch như Thái Hà, Hoàng Cầu, Chùa Bộc ghi nhận giao dịch ổn định, mức giá bình quân phân khúc nhà ngõ 3m đạt từ 180 - 240 triệu đồng/m².'
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
