import { CheckFileType } from "@/utils/CheckFileType";
import ModalManagement from "./ModalManagement";
import PdfViewer from "./PdfViewer";

export default function DocumentViewer ({file}){
     
    return(
        <ModalManagement id={"pdf_viewer"} type={"large"} >
            <div>
            {Array.isArray(file)  ?  
                 file?.map((doc, index) =>
                    CheckFileType(doc) === "img" ? (
                      <img
                        key={index}
                        src={encodeURI(doc)}
                        className="object-cover h-[350px] w-full rounded-[10px]"
                      />
                    ) : <PdfViewer key={index} file={encodeURI(doc)}/>
                )
            
                : <>
                    
                {CheckFileType(file) === "img" ? (
                    <img
                      
                      src={encodeURI(file)}
                      className="object-cover h-[350px] w-full rounded-[10px]"
                    />
                  ) : <PdfViewer  file={encodeURI(file)}/>}
            </>}
            </div>
    </ModalManagement>
    )
}