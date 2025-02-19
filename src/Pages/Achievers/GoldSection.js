import React, { useState } from "react";
import AchieversHeader from "../../components/molecules/AchieversHeader";
import { ResponsiveText } from "../../components/atom/ResponsiveText";
import lineAchievers from "../../assets/images/lineAchievers.png"
import goldenTitle from "../../assets/images/goldenTitle.png"
import { useAuth } from "../../context/DataContext";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslation } from "react-i18next";

const GoldSection = () => {
    const { t } = useTranslation();

    const { isMobileAndSmaller } = useAuth()

    const handleChange = (event) => {
        window.open(event.target.value, '_blank');
    };
    return (
        <div style={{ paddingBottom: 50 }}>
            <div className="container" style={{ marginBottom: 50 }}>
                <div className="row justify-center">
                    <div className="col-md-auto ">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
                <div className="row justify-center place-items-center gx-5" style={{ margin: "60px 0px 60px 0px", textAlignLast: "center" }}>
                    <div className="col-md-12">
                        {/* <ResponsiveText className="goldenText mangolaineFont text-align-center">
                            Gold, Silver & Bronze <br />Achievers
                        </ResponsiveText> */}
                        <img src={goldenTitle} alt="goldenTitle" style={{ width: "70vmin" }} />
                    </div>
                </div>
                <div className="row justify-center">
                    <div className="col-md-auto">
                        <img loading="lazy" src={lineAchievers} alt={`lineAchievers`} style={{ width: "100%" }} />
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col text-align-center textColor" style={{ marginBottom: 50 }}>
                        {t("discoverMore")}:
                    </div>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-3 gy-5 gy-md-1">
                        {/* <Button
                            style={{
                                borderRadius: 5,
                                height: 56
                            }}
                            variant="outlined"> <span className="mosafinFont" onClick={() => handleClickWinner("https://www.instagram.com/p/Cz1BiUrv_2P/?igsh=MWczODQwMGZ5Zm4ybA%3D%3D&img_index=4")}> Christmas Wonderland</span></Button> */}
                        <FormControl fullWidth>
                            <InputLabel
                                className="mosafinFont"
                                id="demo-simple-select-label"
                                sx={{
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            >
                                Christmas Wonderland
                            </InputLabel>
                            <Select
                                className="mosafinFont"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={christmastGold}
                                label="Christmas Wonderland"
                                onChange={handleChange}
                                sx={{
                                    color: 'white',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                <MenuItem value={"https://www.instagram.com/p/Cz1BiUrv_2P/?igsh=MWczODQwMGZ5Zm4ybA%3D%3D&img_index=4"}>Gold</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/Cz1BiUrv_2P/?igsh=MWczODQwMGZ5Zm4ybA%3D%3D&img_index=2"}>Silver</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-12 col-md-3 gy-5 gy-md-1">
                        {/* <Button
                            style={{
                                borderRadius: 5,
                                height: 56
                            }}
                            variant="outlined"> <span className="mosafinFont" onClick={() => handleClickWinner("https://www.instagram.com/p/CwsQegmBlDW/?igsh=MW81dGgxMHNyN2I4bw%3D%3D&img_index=1")}>Classical Festival Jakarta</span> </Button> */}
                        <FormControl fullWidth>
                            <InputLabel
                                className="mosafinFont"
                                id="demo-simple-select-label"
                                sx={{
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            >
                                Classical Festival Jakarta
                            </InputLabel>
                            <Select
                                className="mosafinFont"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={christmastGold}
                                label="Classical Festival Jakarta"
                                onChange={handleChange}
                                sx={{
                                    color: 'white',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                <MenuItem value={"https://www.instagram.com/p/CwsQegmBlDW/?igsh=MW81dGgxMHNyN2I4bw%3D%3D&img_index=5"}>Gold</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/CwsQegmBlDW/?igsh=MW81dGgxMHNyN2I4bw%3D%3D&img_index=4"}>Silver</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/CwsQegmBlDW/?igsh=MW81dGgxMHNyN2I4bw%3D%3D&img_index=2"}>Bronze</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-12 col-md-3 gy-5 gy-md-1">
                        {/* <Button
                            style={{
                                borderRadius: 5,
                                height: 56
                            }}
                            variant="outlined"> <span className="mosafinFont" onClick={() => handleClickWinner("https://www.instagram.com/p/Cv6OG9xhB5b/?igsh=MXF4N3AxbHJvdWQxOQ%3D%3D&img_index=1")}>Classical Festival Surabaya</span></Button> */}
                        <FormControl fullWidth>
                            <InputLabel
                                className="mosafinFont"
                                id="demo-simple-select-label"
                                sx={{
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            >
                                Classical Festival Surabaya
                            </InputLabel>
                            <Select
                                className="mosafinFont"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={christmastGold}
                                label="Classical Festival Surabaya"
                                onChange={handleChange}
                                sx={{
                                    color: 'white',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                <MenuItem value={"https://www.instagram.com/p/Cv6OG9xhB5b/?igsh=MXF4N3AxbHJvdWQxOQ%3D%3D&img_index=4"}>Gold</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/Cv6OG9xhB5b/?igsh=MXF4N3AxbHJvdWQxOQ%3D%3D&img_index=3"}>Silver</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/Cv6OG9xhB5b/?igsh=MXF4N3AxbHJvdWQxOQ%3D%3D&img_index=2"}>Bronze</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="col-12 col-md-3 gy-5 gy-md-1">
                        <FormControl fullWidth>
                            <InputLabel
                                className="mosafinFont"
                                id="demo-simple-select-label"
                                sx={{
                                    color: 'white',
                                    '&.Mui-focused': {
                                        color: 'white',
                                    },
                                }}
                            >
                                Magical Music Soundtrack
                            </InputLabel>
                            <Select
                                className="mosafinFont"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                // value={christmastGold}
                                label="Magical Music Soundtrack"
                                onChange={handleChange}
                                sx={{
                                    color: 'white',
                                    '.MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&:hover .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: 'white',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        color: 'white',
                                    },
                                }}
                            >
                                <MenuItem value={"https://www.instagram.com/p/Cjfu8uKBzc3/?igsh=ZDZqZ2x5YXFtczFx&img_index=1"}>Gold</MenuItem>
                                <MenuItem value={"https://www.instagram.com/p/Cjft4_Qht7q/?igsh=MXAwbG40bTVybWVyaA%3D%3D&img_index=1"}>Silver</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default GoldSection;