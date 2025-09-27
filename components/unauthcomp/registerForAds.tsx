import { useProgram } from "@/context/programContext";
import ModalManagement from "../ModalManagement";
import { useState, useEffect } from "react";
import { Trash2, Minus, Plus } from "lucide-react"; 
import Button from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import { ValidateBoothCouponManager } from "@/app/booths/controllers/boothCouponController";
import { BuyAdvertManager, BuyAdvertMobileManager } from "@/app/adverts/controllers/advertController";

export default function RegisterForADS({selectedAds}){
    const {selectedEventId} = useProgram() 
    
    // State for cart - since you can only have one ad type, cart will have max 1 item
    const [cart, setCart] = useState([]);
    
    // Customer data state
    const [customerData, setCustomerData] = useState({
        email: "",
        name: "",
        phone: ""
    });
    
    // Other states
    const [couponCode, setCouponCode] = useState("");
    const [isMobile, setIsMobile] = useState(false);
    const { buyAdvert, isLoading: buyingAdvert, isSuccess:successAdvert } = BuyAdvertManager({eventId: selectedEventId});
      const { buyAdvertMobile, isLoading: buyingAdvertMobile, isSuccess:successAdvertMobile } = BuyAdvertMobileManager({eventId: selectedEventId});
    const [couponAmount, setCouponAmount] = useState(0)
    const [gotCoupon, setGotCoupon] = useState(false) 
    const {validateCoupon, data,isLoading: validating, isSuccess: validated} = ValidateBoothCouponManager()
    // Initialize cart with selectedAds when component mounts
    useEffect(() => {
        if (selectedAds && cart.length === 0) {
            setCart([{
                advertId: selectedAds.id,
                advert: selectedAds,
                quantity: selectedAds.min_per_order || 1,
                content_url: "",
                preview_image_url: ""
            }]);
        }
    }, [selectedAds]);

    const updateQuantity = (advertId, newQuantity) => {
        if (newQuantity <= 0) {
            // Don't allow removing the item completely since user selected this ad
            return;
        }
        
        const maxAllowed = Math.min(
            selectedAds.max_per_order || 10,
            selectedAds.quantity_remaining
        );
        
        if (newQuantity > maxAllowed) {
            return;
        }

        setCart(cart.map(item => 
            item.advertId === advertId 
                ? { ...item, quantity: newQuantity }
                : item
        ));
    };

    const updateContentUrl = (advertId, url) => {
        setCart(cart.map(item => 
            item.advertId === advertId 
                ? { ...item, content_url: url }
                : item
        ));
    };

    const updatePreviewUrl = (advertId, url) => {
        setCart(cart.map(item => 
            item.advertId === advertId 
                ? { ...item, preview_image_url: url }
                : item
        ));
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.advert.price * item.quantity), 0);
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
            adverts: cart.map(item => ({
                advertId: item.advertId,
                quantity: item.quantity,
                ...(item.content_url && { content_url: item.content_url }),
                ...(item.preview_image_url && { preview_image_url: item.preview_image_url }),
            })),
            ...(couponCode && { couponCode }),
        };

        try {
            const eventId = selectedAds.event; // Get event ID from selectedAds
            if (isMobile) {
                await buyAdvertMobile(bookingData);
            } else {
                await buyAdvert(bookingData);
            }
             
        } catch (error) {
            console.error("Booking failed:", error);
        }
    };
    useEffect(() => {
            if(validated){ 
                setGotCoupon(true)
                setCouponAmount(data?.data?.discount_amount)
            }
        }, [validated])

    const handleClose = () => {
        // Reset form
        setCart([]);
        setCustomerData({ email: "", name: "", phone: "" });
        setCouponCode("");
        // onClose(); // Uncomment if you have onClose function
    };

    useEffect(() => {
        if(successAdvert){
            handleClose()
        } 
        if(successAdvertMobile){
            handleClose()
        }
    }, [successAdvert, successAdvertMobile]) 

    if (!selectedAds) {
        return null;
    } 

    return(
        <ModalManagement className={""} hasSpecFunc specialFunc={() => {handleClose()}} type={"medium"} id={"book-ads"} title={"Book Ads"}>
            <div className="">
                <div className="space-y-4 my-6 max-h-80 overflow-y-auto">
                    {cart.map((item) => (
                        <div key={item.advertId} className="bg-signin  p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h6 className="font-medium capitalize text-white">{item.advert.name}</h6>
                                    <div className="text-xs text-white/50 flex gap-2">
                                        <span>{item.advert.format}</span>
                                        <span>•</span>
                                        <span>{item.advert.dimensions}</span>
                                        <span>•</span>
                                        <span>{item.advert.placement}</span>
                                    </div>
                                    <span className="text-sm text-white/60">
                                        {item.advert.currency} {item.advert.price.toLocaleString()} each
                                    </span>
                                </div>
                                <div className="w-fit p-[6px] rounded-[2px] bg-white text-[15px] font-medium leading-[10px] text-backgroundPurple">
                                        {item.advert.category?.name}
                                    </div>
                            </div>
                             
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQuantity(item.advertId, item.quantity - 1)}
                                        className="p-1 border border-black rounded group hover:bg-gray-100"
                                        disabled={item.quantity <= (item.advert.min_per_order || 1)}
                                    >
                                        <Minus size={14} className="text-white group-hover:text-black" />
                                    </button>
                                    <span className="px-3 py-1 border text-white border-black rounded min-w-[50px] text-center">
                                        {item.quantity}
                                    </span>
                                    <button
                                        onClick={() => updateQuantity(item.advertId, item.quantity + 1)}
                                        className="p-1 border border-black rounded group hover:bg-gray-100"
                                        disabled={item.quantity >= Math.min(
                                            item.advert.max_per_order || 10,
                                            item.advert.quantity_remaining
                                        )}
                                    >
                                        <Plus size={14}  className="text-white group-hover:text-black"/>
                                    </button>
                                </div>
                                <span className="font-medium text-white">
                                    {item.advert.currency} {(item.advert.price * item.quantity).toLocaleString()}
                                </span>
                            </div>
     
                            <div className="space-y-2">
                                <input
                                    type="url"
                                    placeholder="Content URL (optional)"
                                    value={item.content_url}
                                    onChange={(e) => updateContentUrl(item.advertId, e.target.value)}
                                    className="w-full text-xs p-2 border rounded"
                                />
                                <input
                                    type="url"
                                    placeholder="Preview Image URL (optional)"
                                    value={item.preview_image_url}
                                    onChange={(e) => updatePreviewUrl(item.advertId, e.target.value)}
                                    className="w-full text-xs p-2 border rounded"
                                />
                            </div>
                            
                            <div className="text-xs text-white/50 mt-2">
                                Available: {item.advert.quantity_remaining} | 
                                Min: {item.advert.min_per_order || 1} | 
                                Max: {item.advert.max_per_order || 10}
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
                                {cart[0]?.advert.currency} {calculateTotal().toLocaleString()}
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
                            isLoading={buyingAdvert || buyingAdvertMobile}
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