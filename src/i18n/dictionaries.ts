export const dictionaries = {
  en: {
    available: "Available for Work",
    contact: "Contact Me",
    resume: "View Resume",
    experience: "Work Experience",
    projectsLabel: "Projects involved:",
    roleLabel: "Role:",
    personalProjectsLabel: "Personal Projects",
    education: "Education",
    skillsLabel: "Skills",
    technical: "Technical",
    language: "Languages",
    other: "Other",
    ctaTitle: "Ready to collaborate?",
    ctaDesc: "I am always open to new career opportunities and freelance projects.",
    graduation: {
      Excellent: "Excellent",
      Good: "Good",
      Fair: "Fair",
      Average: "Average"
    } as Record<string, string>
  },
  vi: {
    available: "Sẵn sàng làm việc",
    contact: "Liên hệ ngay",
    resume: "Xem CV",
    experience: "Kinh nghiệm làm việc",
    projectsLabel: "Các dự án đã tham gia:",
    roleLabel: "Vai trò:",
    personalProjectsLabel: "Dự án cá nhân",
    education: "Học vấn",
    skillsLabel: "Kỹ năng",
    technical: "Chuyên môn",
    language: "Ngoại ngữ",
    other: "Khác",
    ctaTitle: "Sẵn sàng hợp tác?",
    ctaDesc: "Mình luôn cởi mở với các cơ hội nghề nghiệp và dự án freelance mới.",
    graduation: {
      Excellent: "Xuất sắc",
      Good: "Giỏi",
      Fair: "Khá",
      Average: "Trung bình"
    } as Record<string, string>
  }
}

export const getDictionary = (locale: string) => {
  return dictionaries[locale as keyof typeof dictionaries] || dictionaries.vi
}
