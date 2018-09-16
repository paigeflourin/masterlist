import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';

interface IPeople extends IPersonaProps {
    Id?: number;
    Title?: string;
    Name?: string;
    Email?: string;
    IsSiteAdmin?: boolean;
    PictureUrl?: string;
}

export default IPeople;
