export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface Link {
  id: string;
  name: string;
  url: string;
  tags: Tag[];
  createdAt: string;
}
