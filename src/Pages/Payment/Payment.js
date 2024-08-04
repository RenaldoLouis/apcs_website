import React, { useEffect, useRef, useState } from "react";
import apis from "../../apis";
import PillButton from "../../components/atom/PillButton";
import CoverImageHome from "../../components/molecules/CoverImageHome";
import musiciswhatapcs from "../../assets/images/musiciswhatapcs.svg"
import aboutCover2 from "../../assets/images/aboutCover2.png"
import { ContentPosition } from "../../constant/ContentPosition";
import { Button } from "antd";

const Payment = () => {

    const handleCreatePayment = () => {
        const tempData = {
            "amount": "500",
            "currency": "IDR",
            "payment_method": "CC",
            "confirmation_method": "manual",
            "confirm": "true"
        }
        apis.payment.createPayment(tempData)
    }
    return (
        <div>

            <CoverImageHome background={aboutCover2}
                logo={musiciswhatapcs}
                position={ContentPosition.MIDDLELEFT40}
                bigLogo={true}
            />
            <h1>Stripe Payment Example</h1>
            adas
            <Button onClick={handleCreatePayment} type="primary">Primary Button</Button>
        </div>
    )
}

export default Payment;