//Вспомогательная программа "Contains(char, str)": Поиск символа в строке
function Contains(char, str) {

    // Проходим по каждому символу строки
    for (let j = 0; j < str.length; j++) {
        //Сравниваем j-ый символ строки с искомым символом "char"
        if (str[j] === char) {
            // Если символ найден, возвращаем "true"
            return true;
        }
    }
    // Если символ не найден, возвращаем "false"
    return false;
}

//Основная программа
function removeMatchingLetters(string_A, string_B) {
    //Инициализируем переменные для хранения текущего индекса, флага наличия символа и результирующей строки
    let i = 0;
    let contains_flag = false;
    let string_C = ""; //пустая строка или строка длины string_A, для некоторых других языков программирования

    // Проходим по каждому символу строки A и проверяем, содержится ли он в строке B
    while (i < string_A.length) {
        // Вызываем всопомгательную функцию "Contains" для проверки наличия символа в строке B
        contains_flag = Contains(string_A[i], string_B);

        //Проверяем результат функции "Contains"
        if (!contains_flag) {
            // Если символ не содержится в строке B, добавляем его в строки C
            string_C += string_A[i];
        }

        // Переходим к следующему символу строки A
        i++;
    }

    // Возвращаем результирующую строку C
    return string_C;
}

// Примеры использования:
const args = process.argv.slice(2);
const wordA = args[0] || "программа";
const wordB = args[1] || "гора";

const result = removeMatchingLetters(wordA, wordB);
console.log(`Исходное слово: ${wordA}`);
console.log(`Символы для удаления: ${wordB}`);
console.log(`Результат: ${result}`);
