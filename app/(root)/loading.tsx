import React from "react";

const Loading = () => {
    return (
        <div className="flex h-full w-full items-center justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
    );
};

export default Loading;
