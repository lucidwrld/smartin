import { useProgram } from "@/context/programContext";
import ModalManagement from "../ModalManagement";
import { useState, useEffect } from "react";
import { Trash2, Minus, Plus } from "lucide-react"; 
import Button from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import { BuyBoothManager, BuyBoothMobileManager } from "@/app/booths/controllers/boothController";

export default function RegisterForBooth({selectedBooth}){
    const {selectedEventId} = useProgram()  
    const [cart, setCart] = useState([]);
    const { buyBooth, isLoading: buyingBooth, isSuccess:successBooth } = BuyBoothManager({eventId: selectedEventId});
    const { buyBoothMobile, isLoading: buyingBoothMobile,  isSuccess:successBoothMobile  } = BuyBoothMobileManager({eventId: selectedEventId});
    // Customer data state
    const [customerData, setCustomerData] = useState({
        email: "",
        name: "",
        phone: ""
    });
    
    // Other states
    const [couponCode, setCouponCode] = useState("");
    const [isMobile, setIsMobile] = useState(false); 

    // Initialize cart with selectedBooth when component mounts
    useEffect(() => {
        if (selectedBooth && cart.length === 0) {
            setCart([{
                boothId: selectedBooth.id,
                booth: selectedBooth,
                quantity: selectedBooth.min_per_order || 1, 
            }]);
        }
    }, [selectedBooth]);

    const updateQuantity = (boothId, newQuantity) => {
        if (newQuantity <= 0) {
            // Don't allow removing the item completely since user selected this ad
            return;
        }
        
        const maxAllowed = Math.min(
            selectedBooth.max_per_order || 10,
            selectedBooth.quantity_remaining
        );
        
        if (newQuantity > maxAllowed) {
            return;
        }

        setCart(cart.map(item => 
            item.boothId === boothId 
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };
 

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.booth.price * item.quantity), 0);
    };

     

    const handleBooking = async (e) => {
        e.preventDefault();
        
        if (!customerData.email || !customerData.name) {
            return;
        }

        if (cart.length === 0) {
            return;
        }

        const bookingData = {
            email: customerData.email,
            name: customerData.name,
            path: `public/event/${selectedEventId}`,
            booths: cart.map(item => ({
                boothId: item.boothId,
                quantity: item.quantity, 
            })),
            ...(couponCode && { couponCode }),
        };

        try {
            const eventId = selectedBooth.event; // Get event ID from selectedBooth
            if (isMobile) {
                await buyBoothMobile(bookingData);
            } else {
                await buyBooth(bookingData);
            }
             
        } catch (error) {
            console.error("Booking failed:", error);
        }
    };

    const handleClose = () => {
        // Reset form
        setCart([]);
        setCustomerData({ email: "", name: "", phone: "" });
        setCouponCode("");
        // onClose(); // Uncomment if you have onClose function
    };

    useEffect(() => {
            if(successBooth){
                handleClose()
            } 
            if(successBoothMobile){
                handleClose()
            }
        }, [successBooth, successBoothMobile]) 
    if (!selectedBooth) {
        return null;
    } 

    return(
        <ModalManagement className={""} hasSpecFunc specialFunc={() => {handleClose()}} type={"medium"} id={"book-booth"} title={"Book Booth"}>
            <div className="">
                <div className="space-y-4 my-6 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                        <div key={item.boothId} className="bg-signin  p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h6 className="font-medium capitalize text-white">{item.booth.name}</h6>
                                    <div className="text-xs text-white/50 flex gap-2">
                                        <span>{item.booth.size}</span>
                                        <span>•</span>
                                        <span>{item.booth.location}</span> 
                                    </div>
                                    <span className="text-sm text-white/60">
                                        {item.booth.currency} {item.booth.price.toLocaleString()} each
                                    </span>
                                </div>
                                <div className="w-fit p-[6px] rounded-[2px] bg-white text-[15px] font-medium leading-[10px] text-backgroundPurple">
                                        {item.booth.category?.name}
                                    </div>
                            </div>
                             
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.boothId, item.quantity - 1)}
                                        className="p-1 border border-black rounded group hover:bg-gray-100"
                                        disabled={item.quantity <= (item.booth.min_per_order || 1)}
                                    >
                                        <Minus size={14} className="text-white group-hover:text-black" />
                                    </button>
                                    <span className="px-3 py-1 border text-white border-black rounded min-w-[50px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.boothId, item.quantity + 1)}
                                        className="p-1 border border-black rounded group hover:bg-gray-100"
                                        disabled={item.quantity >= Math.min(
                                            item.booth.max_per_order || 10,
                                            item.booth.quantity_remaining
                                        )}
                                    >
                                        <Plus size={14}  className="text-white group-hover:text-black"/>
                                    </button>
                                </div>
                                <span className="font-medium text-white">
                                    {item.booth.currency} {(item.booth.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
     
                            
                            
                            <div className="text-xs text-white/50 mt-2">
                                Available: {item.booth.quantity_remaining} | 
                                Min: {item.booth.min_per_order || 1} | 
                                Max: {item.booth.max_per_order || 10}
                            </div>
                        </div>
                    ))}
                </div>
 
                <form onSubmit={handleBooking} className="space-y-4">
                    <InputWithFullBoarder
                        label="Email Address"
                        type="email"
                        value={customerData.email}
                        onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                        isRequired
                        placeholder="your@email.com" id={undefined} form={undefined} tokens={undefined} checked={undefined} onClick={undefined} className={undefined} min={undefined} labelClass={undefined} labelColor={undefined} message={undefined} maxLength={undefined} minLength={undefined} hasSuffix={undefined} icon={undefined} accept={undefined} none={undefined} wrapperClassName={undefined} customValidator={undefined} customErrorMessage={undefined} errorProp={undefined} touchedProp={undefined}                    />

                    <InputWithFullBoarder
                        label="Full Name"
                        value={customerData.name}
                        onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                        isRequired
                        placeholder="Your full name" id={undefined} form={undefined} tokens={undefined} checked={undefined} onClick={undefined} className={undefined} min={undefined} labelClass={undefined} labelColor={undefined} message={undefined} maxLength={undefined} minLength={undefined} hasSuffix={undefined} icon={undefined} accept={undefined} none={undefined} wrapperClassName={undefined} customValidator={undefined} customErrorMessage={undefined} errorProp={undefined} touchedProp={undefined}                    />

                    <InputWithFullBoarder
                        label="Phone Number (Optional)"
                        value={customerData.phone}
                        onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                        placeholder="+1234567890" id={undefined} form={undefined} tokens={undefined} checked={undefined} onClick={undefined} className={undefined} min={undefined} labelClass={undefined} labelColor={undefined} message={undefined} maxLength={undefined} minLength={undefined} hasSuffix={undefined} icon={undefined} accept={undefined} none={undefined} wrapperClassName={undefined} customValidator={undefined} customErrorMessage={undefined} errorProp={undefined} touchedProp={undefined}                    />

                    <InputWithFullBoarder
                        label="Coupon Code (Optional)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code" id={undefined} form={undefined} tokens={undefined} checked={undefined} onClick={undefined} className={undefined} min={undefined} labelClass={undefined} labelColor={undefined} message={undefined} maxLength={undefined} minLength={undefined} hasSuffix={undefined} icon={undefined} accept={undefined} none={undefined} wrapperClassName={undefined} customValidator={undefined} customErrorMessage={undefined} errorProp={undefined} touchedProp={undefined}                    />
 
                    <div>
                        <label className="block text-sm font-medium mb-2">Payment Method</label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={!isMobile}
                                    onChange={() => setIsMobile(false)}
                                    className="mr-2"
                                />
                                Web Payment
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    checked={isMobile}
                                    onChange={() => setIsMobile(true)}
                                    className="mr-2"
                                />
                                Mobile Payment
                            </label>
                        </div>
                    </div>
 
                    <div className="bg-purple-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-2xl font-bold text-purple-600">
                                {cart[0]?.booth.currency} {calculateTotal().toLocaleString()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            {cart.reduce((total, item) => total + item.quantity, 0)} ad space(s)
                        </p>
                    </div>
 
                    <div className="flex gap-3">
                        {/* <Button
                            buttonText="Cancel"
                            onClick={handleClose}
                            buttonColor="bg-gray-200"
                            textColor="text-gray-700"
                            className="flex-1"
                        /> */}
                        <Button
                            buttonText="Complete Booking"
                            type="submit"
                            isLoading={buyingBooth || buyingBoothMobile}
                            buttonColor="bg-signin"
                            textColor="text-white"
                            className="flex-1"
                            disabled={cart.length === 0 || !customerData.email || !customerData.name}
                        />
                    </div>
                </form>
            </div>
        </ModalManagement>
    )
}