import '../styles/globals.css'
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, Semibold, Bold
  style: ["normal", "italic"], // agar italic chahiye to ye zaroor likho
  variable: "--font-poppins",
});


export const metadata = {
  title: 'nothingham',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-[var(--font-poppins)]">
        {children}
      </body>
    </html>
  )
}
