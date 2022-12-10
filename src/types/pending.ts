interface PendingItemProps {
  id: string;
  senderId: string;
  recipientId: string;
  status: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    imagePath: string;
  };
}

export interface PendingProps {
  pendings: PendingItemProps[];
  amountPendings: number;
}
