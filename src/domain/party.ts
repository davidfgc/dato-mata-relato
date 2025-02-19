export default interface Party {
  id: string;
  name: string;
  official_name?: string;
  founding_year: number;
  ideology: string[];
  position: string;
  government_position: string;
  senators: number;
  representatives: number;
  president: string;
  international_affiliation?: string;
  slogan?: string;
  notes?: string;
  coalition?: string;
  headquarters?: string;
}
