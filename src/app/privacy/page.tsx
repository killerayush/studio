import { Navbar } from '@/components/navbar';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-headline font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-invert lg:prose-xl text-muted-foreground space-y-4">
            <p>Welcome to VYXEN's Privacy Policy. Your privacy is important to us.</p>
            <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. We will not use or share your information with anyone except as described in this Privacy Policy.</p>
            <h2 className="text-2xl font-bold text-white">Information Collection and Use</h2>
            <p>For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, email, and style preferences. The information that we request will be retained by us and used as described in this privacy policy.</p>
            <p>The app does use third-party services that may collect information used to identify you. Link to the privacy policy of third-party service providers used by the app:</p>
            <ul>
              <li><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Services</a></li>
              <li><a href="https://firebase.google.com/policies/analytics" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Analytics</a></li>
            </ul>
            <h2 className="text-2xl font-bold text-white">Security</h2>
            <p>We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
            <h2 className="text-2xl font-bold text-white">Changes to This Privacy Policy</h2>
            <p>We may update our Privacy Policy from time to time. Thus, you are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately after they are posted on this page.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
