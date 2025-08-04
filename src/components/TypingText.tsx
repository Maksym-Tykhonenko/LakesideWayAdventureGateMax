import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, LayoutChangeEvent, Dimensions } from 'react-native';

interface TypingTextProps {
    text: string;
    speed?: number; // Швидкість друкування (мс між символами)
    style?: object; // Стиль тексту
    onLayout?: (event: LayoutChangeEvent) => void; // Додаємо проп onLayout
}

const TypingText: React.FC<TypingTextProps> = ({ text, speed = 50, style, onLayout }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let currentIndex = 0;
        setDisplayedText(text.charAt(0)); // Встановлюємо першу літеру одразу

        const interval = setInterval(() => {
            currentIndex++;
            if (currentIndex < text.length) {
                setDisplayedText((prev) => prev + text.charAt(currentIndex));
            } else {
                clearInterval(interval); // Зупиняємо інтервал, коли текст повністю надруковано
            }
        }, speed);

        return () => clearInterval(interval); // Очищення інтервалу при розмонтуванні
    }, [text, speed]);

    return (
        <Text style={[styles.text, style]} onLayout={onLayout}>
            {displayedText}
        </Text>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#FFFFFF',
        fontSize: Dimensions.get('window').width * 0.05,
    },
});

export default TypingText;
