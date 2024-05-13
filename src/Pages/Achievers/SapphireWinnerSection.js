import React from "react";

const SapphireWinnerSection = () => {

    return (
        <div className="primaryBackgroundBlack" style={{ paddingTop: 300, paddingBottom: 110 }}>
            <div class="container color-white">
                <div class="row">
                    <div class="col-sm">
                        <img style={{ aspectRatio: "1/1",objectFit:"cover",width:"100%" }} src='https://images.unsplash.com/photo-1661435805196-81136edfa297?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMjM4NDZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI5OTQxMTQ&ixlib=rb-1.2.1&q=80&w=400' alt='' />
                        John Doe
                    </div>
                    <div class="col-sm">
                        One of three columns
                    </div>
                    <div class="col-sm">
                        One of three columns
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SapphireWinnerSection;