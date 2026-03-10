import styled from 'styled-components';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

const Header = styled.div`
  background: linear-gradient(135deg, hsl(28, 85%, 52%), hsl(35, 90%, 58%));
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled.button`
  background: hsla(0, 0%, 100%, 0.2);
  border: none;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  &:hover { background: hsla(0, 0%, 100%, 0.35); }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  letter-spacing: -0.3px;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  background: hsla(0, 0%, 100%, 0.2);
  border: 1px solid hsla(0, 0%, 100%, 0.3);
  color: white;
  padding: 6px 12px 6px 34px;
  border-radius: 6px;
  font-size: 14px;
  width: 220px;
  outline: none;
  transition: background 0.15s;
  &::placeholder { color: hsla(0, 0%, 100%, 0.7); }
  &:focus { background: hsla(0, 0%, 100%, 0.3); }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  width: 16px;
  height: 16px;
  opacity: 0.8;
`;

interface Props {
  monthName: string;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function CalendarHeader({ monthName, year, onPrev, onNext, searchQuery, onSearchChange }: Props) {
  return (
    <Header>
      <NavGroup>
        <NavButton onClick={onPrev}><ChevronLeft size={18} /></NavButton>
        <NavButton onClick={onNext}><ChevronRight size={18} /></NavButton>
        <Title>{monthName} {year}</Title>
      </NavGroup>
      <SearchWrapper>
        <SearchIcon />
        <SearchInput
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
        />
      </SearchWrapper>
    </Header>
  );
}
