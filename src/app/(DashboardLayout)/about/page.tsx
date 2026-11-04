import About from '@/ui/about/About';
import { getVersions } from '@/lib/versions';

const AboutPage = () => {
  return (
    <About versions={getVersions()} />
  );
}

export default AboutPage;
