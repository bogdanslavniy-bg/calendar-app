import styled from 'styled-components';
import { CalendarGrid } from '@/components/calendar/CalendarGrid';

const Page = styled.div`
  min-height: 100vh;
  background: hsl(220, 14%, 96%);
  padding: 24px 16px;
`;

const Index = () => {
  return (
    <Page>
      <CalendarGrid />
    </Page>
  );
};

export default Index;
