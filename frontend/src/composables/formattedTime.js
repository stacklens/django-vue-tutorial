export default function formattedTime(iso_date_string) {
    const date = new Date(iso_date_string);
    return date.toLocaleDateString()
}