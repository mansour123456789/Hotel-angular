export interface reviewDto {
    reviewid: string;
    userid: string;
    title: string;
    rating: number;
    text: string;
    firstname?: string; // Permet null ou undefined
    lastname?: string; // Permet null ou undefined
    photo: string;
    createdAt: string;
}
