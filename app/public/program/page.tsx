"use client"
import { ProgramItem } from "@/app/events/types";
import { useProgram } from "@/context/programContext";
import { formatDate } from "@/utils/formatDate";
import { ArrowLeft, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Program (){ 
    const {selectedProgram, selectedEventId} = useProgram() 
    const router = useRouter()
    const [isGenerating, setIsGenerating] = useState(false)
    const contentRef = useRef<HTMLDivElement>(null)
    
    const themeClasses = {
        bg: "bg-[#0a0e27]",
        text: "text-white",
        card: "bg-[#0d1129]",
        cardBorder: "border-slate-800",
        cardHover: "hover:border-slate-700", 
    };

      const downloadPDF = async () => {
        if (!contentRef.current) return;
        
        setIsGenerating(true);
        try {
            // Create canvas from the content div
            const canvas = await html2canvas(contentRef.current, {
                scale: 2, // Higher quality
                useCORS: true,
                backgroundColor: '#0a0e27', // Match your background
                width: contentRef.current.scrollWidth,
                height: contentRef.current.scrollHeight,
                allowTaint: true,
                logging: false,
                ignoreElements: (element) => {
                    // Ignore any elements with specific classes if needed
                    return false;
                }
            });

            // Calculate PDF dimensions to fill the page
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            // Calculate scaling to fit width and maintain aspect ratio
            const ratio = Math.min(pdfWidth / (canvasWidth * 0.264583), pdfHeight / (canvasHeight * 0.264583));
            const imgWidth = canvasWidth * 0.264583 * ratio;
            const imgHeight = canvasHeight * 0.264583 * ratio;
            
            // Center the image on the page
            const x = 0;
            const y = 0;

            // Add the image to PDF
            pdf.addImage(
                canvas.toDataURL('image/png', 1.0),
                'PNG',
                x,
                y,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

            // If content is too tall, handle multiple pages
            if (imgHeight > pdfHeight) {
                let remainingHeight = imgHeight - pdfHeight;
                let currentY = -pdfHeight + y;
                
                while (remainingHeight > 0) {
                    pdf.addPage();
                    pdf.addImage(
                        canvas.toDataURL('image/png', 1.0),
                        'PNG',
                        x,
                        currentY,
                        imgWidth,
                        imgHeight,
                        undefined,
                        'FAST'
                    );
                    remainingHeight -= pdfHeight;
                    currentY -= pdfHeight;
                }
            }

            // Download the PDF
            const fileName = `${selectedProgram?.eventDetails?.name || 'Event'}_Program.pdf`;
            pdf.save(fileName);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };
 
    return(
        <div className={`w-full h-full min-h-screen p-5 gap-5 transition-colors flex flex-col items-center duration-300 ${themeClasses.bg} ${themeClasses.text}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-brandPurple/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute right-0 top-1/4 w-96 h-96 bg-brandPurple/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-brandPurple/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Navigation buttons - NOT included in PDF */}
            <div className="w-full h-fit flex justify-between">
                <div onClick={() => {router.back()}} className="w-fit h-fit flex cursor-pointer items-center px-4 py-2 bg-white rounded-[20px]">
                    <ArrowLeft color="#000" />
                </div>
                <div 
                    onClick={downloadPDF}
                    className={`w-fit h-fit flex items-center text-white gap-2 rounded-[20px] px-4 py-2 cursor-pointer ${
                        isGenerating ? 'bg-gray-600' : 'bg-signin hover:bg-signin/80'
                    } transition-colors`}
                >
                    {isGenerating ? 'Generating...' : 'Download PDF'} 
                    <Download color="#fff" />
                </div>
            </div>
            
            {/* Content to be captured for PDF - includes all background elements */}
            <div ref={contentRef} className={`relative w-full   flex flex-col items-center ${themeClasses.bg}`}>
                {/* Background gradients for PDF */}
                <div className="absolute inset-0 bg-gradient-to-br from-brandPurple/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute right-0 top-1/4 w-96 h-96 bg-brandPurple/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-brandPurple/10 rounded-full blur-3xl pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-10 w-full h-auto flex max-w-[1000px] flex-col px-10 items-center pt-10">
                <h1 className="text-white text-[25px] font-light">Event Program</h1>
                <h1 className="text-white text-[65px] font-bold">{selectedProgram?.eventDetails?.name}</h1>
                <h1 className="text-white text-[15px] font-light">Date: {formatDate(selectedProgram?.eventDetails?.date)}</h1>
                <h1 className="text-white text-[15px] font-light">Venue: {selectedProgram?.eventDetails?.venue}</h1>
                <div className="w-full h-1 bg-white mt-6"></div>
                <div className="w-full h-fit py-5 flex flex-col gap-2">
                    <p className="text-white font-bold text-[20px]">
                        {`${formatDate(selectedProgram?.program?.date)} | ${selectedProgram?.program?.start_time} - ${selectedProgram?.program?.end_time}`}
                    </p>
                    <p className="text-white font-bold text-[20px]">
                        {selectedProgram?.program?.title || selectedProgram?.program?.description}
                    </p>
                    <p className="text-white text-[15px]">
                        <span className="font-bold text-[20px]">
                            Speaker: {""}
                        </span>
                         {selectedProgram?.program?.speaker}{selectedProgram?.program?.speaker_title ? ` - ${selectedProgram?.program?.speaker_title}`: ""}
                    </p>
                    <p className="text-white text-[15px]">
                        <span className="font-bold text-[20px]">
                            Location: {""}
                        </span>
                        {selectedProgram?.program?.location}
                    </p>
                    <p className="text-white font-bold text-[20px]">
                        {selectedProgram?.program?.type}
                    </p> 
                </div>
            </div>
        </div>
        </div>
    )
}