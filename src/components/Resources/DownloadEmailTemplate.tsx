// src/components/Email/DownloadEmailTemplate.tsx
import * as React from 'react';

interface DownloadEmailTemplateProps {
  firstName: string;
  resourceTitle: string;
  downloadUrl: string;
  userEmail: string;
}

export const DownloadEmailTemplate: React.FC<Readonly<DownloadEmailTemplateProps>> = ({
  firstName,
  resourceTitle,
  downloadUrl,
  userEmail,
}) => (
  <div style={{ 
    margin: 0, 
    padding: 0, 
    fontFamily: 'Arial, sans-serif', 
    lineHeight: 1.6, 
    color: '#343434', 
    backgroundColor: '#f4f4f4' 
  }}>
    {/* Hidden preheader text */}
    <div style={{ 
      display: 'none', 
      visibility: 'hidden', 
      opacity: 0, 
      color: 'transparent', 
      height: 0, 
      width: 0, 
      maxHeight: 0, 
      maxWidth: 0, 
      overflow: 'hidden' 
    }}>
      You can access your free guide from this email at anytime
    </div>

    {/* Email body */}
    <table width="100%" cellPadding="0" cellSpacing="0" style={{ backgroundColor: '#f4f4f4', padding: '20px' }}>
      <tbody>
        <tr>
          <td align="center">
            <table width="600" cellPadding="0" cellSpacing="0" style={{ 
              backgroundColor: '#ffffff', 
              borderRadius: '8px', 
              overflow: 'hidden', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
            }}>
              <tbody>
                <tr>
                  <td align="center" style={{ padding: '30px 40px', backgroundColor: '#fbd113' }}>
                    <img src="https://ready-set.co/images/logo/logo.png" alt="Ready Set Logo" width="150" style={{ display: 'block' }} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '40px' }}>
                    <h1 style={{ margin: '0 0 20px', color: '#343434', fontSize: '24px', fontWeight: 'bold' }}>Hi {firstName}!</h1>
                    <p style={{ margin: '0 0 20px', fontSize: '16px', color: '#343434' }}>
                      Thank you for downloading {resourceTitle}. You can access your guide here:
                    </p>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td align="center" style={{ padding: '20px 0' }}>
                            <a href={downloadUrl} style={{
                              display: 'inline-block',
                              padding: '14px 30px',
                              backgroundColor: '#fbd113',
                              color: '#343434',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}>Download {resourceTitle}</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style={{ margin: '20px 0', fontSize: '16px', color: '#343434' }}>
                      Looking to apply these strategies to your business? Schedule a free consultation with our team, and we'll help you get started.
                    </p>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td align="center" style={{ padding: '10px 0 20px' }}>
                            <a href="https://ready-set.co/contact" style={{
                              display: 'inline-block',
                              padding: '12px 25px',
                              backgroundColor: '#facc15',
                              color: '#343434',
                              textDecoration: 'none',
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              textAlign: 'center'
                            }}>Schedule a Consultation</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p style={{ margin: '20px 0', fontSize: '16px', color: '#343434' }}>
                      All the best, <br />
                      The Ready Set Team
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: '#343434', padding: '30px 40px' }}>
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td align="center">
                            <img 
                              src="https://res.cloudinary.com/dlqu2l2ia/image/upload/v1738910182/logo-dark_aebe9q.png" 
                              alt="Ready Set Co Logo" 
                              style={{ marginBottom: '20px', maxWidth: '200px', height: 'auto' }}
                            />
                            <p style={{ margin: '0 0 10px', color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Follow us!</p>
                            <p style={{ margin: '0 0 20px' }}>
                              <a href="https://www.facebook.com/ReadySetCoGroup/" style={{ display: 'inline-block', margin: '0 10px', textDecoration: 'none' }}>
                                <img src="https://readysetllc.com/images/social/1.png" alt="Facebook" style={{ width: '24px', height: '24px' }} />
                              </a>
                              <a href="https://www.tiktok.com/@readyset.co" style={{ display: 'inline-block', margin: '0 10px', textDecoration: 'none' }}>
                                <img src="https://readysetllc.com/images/social/2.png" alt="TikTok" style={{ width: '24px', height: '24px' }} />
                              </a>
                              <a href="https://www.instagram.com/readyset.co/" style={{ display: 'inline-block', margin: '0 10px', textDecoration: 'none' }}>
                                <img src="https://readysetllc.com/images/social/3.png" alt="Instagram" style={{ width: '24px', height: '24px' }} />
                              </a>
                              <a href="http://linkedin.com/company/ready-set-group-llc/" style={{ display: 'inline-block', margin: '0 10px', textDecoration: 'none' }}>
                                <img src="https://readysetllc.com/images/social/4.png" alt="LinkedIn" style={{ width: '24px', height: '24px' }} />
                              </a>
                            </p>
                            <p style={{ color: '#FFFFFF', fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: 1.5, margin: '0 0 10px' }}>
                              Ready Set Group, LLC | 166 Geary St, STE 1500 | San Francisco, CA 94108
                            </p>
                            <p style={{ margin: 0, color: '#c4c2bd', fontSize: '12px' }}>
                              This email was sent to {userEmail} by Ready Set. If you did not request this download, please disregard this message.
                            </p>
                            <p style={{ margin: '10px 0 0', color: '#c4c2bd', fontSize: '12px' }}>
                              <a href="https://ready-set.co/unsubscribe" style={{ color: '#fbd113' }}>Unsubscribe</a> |
                              <a href="https://ready-set.co/privacy-policy" style={{ color: '#fbd113' }}>Privacy Policy</a>
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);