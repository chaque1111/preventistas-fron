export default function getDate(){
    const today = new Date()
    
    return today.toLocaleDateString();
}