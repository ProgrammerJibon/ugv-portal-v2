"use client";

import { useState, useEffect, useRef } from "react";

export default function Image(props) {
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const alt = props.alt || "BrainSolve | Code Assesment Arena";

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth === 0) {
            setHasError(true);
        }
    }, []);

    const handleError = () => {
        console.log("firing on error");
        setHasError(true);
    };

    if (!props.src) {
        return (
            <div className="bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-2xl select-none pointer-events-none">
                {alt.charAt(0)}
            </div>
        );
    }

    return !hasError ? (
        <img
            {...props}
            ref={imgRef}
            alt={alt}
            src={props.src}
            onError={handleError}
        />
    ) : (
            <div {...props} className={`flex text-center justify-center items-center select-none pointer-events-none` + " " + props?.className}>
            {alt.charAt(0)}
        </div>
    );
}