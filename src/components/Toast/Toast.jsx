import React, { useState, useEffect } from 'react';

const Toast = ({ message, duration = 3000, onClose }) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            onClose();
        }, duration);

        return () => {
            clearTimeout(timer);
        };
    }, [duration, onClose]);

    return (
        <div className={`toast ${visible ? 'show' : 'hide'}`}>
            <div className="toast-body">
                <div className="alert alert-primary">
                    {message}
                </div>
            </div>
        </div>
    );
};

export default Toast;
