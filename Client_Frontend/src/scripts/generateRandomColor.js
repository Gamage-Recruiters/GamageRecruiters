// const generateRandomColor = () => {
//     return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
// }

const generateRandomColor = () => {
    const color = Math.floor(Math.random() * 16777215).toString(16);
    return `#${color.padStart(6, '0')}`;
  };

export default generateRandomColor;