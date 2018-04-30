export interface Goal {
    _id: string;
    userID: string;
    name: string;
    owner: string;
    body: string;
    category: string;
    startDate: string;
    endDate: string;
    frequency: string;
    status: boolean;
}
