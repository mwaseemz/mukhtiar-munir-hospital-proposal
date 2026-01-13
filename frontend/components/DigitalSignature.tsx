'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Pen, Check, X } from 'lucide-react';

interface DigitalSignatureProps {
  userName: string;
  userRole: string;
  onSignatureComplete: (signatureData: SignatureData) => void;
  required?: boolean;
}

export interface SignatureData {
  signatureText: string;
  signatureStyle: string;
  timestamp: string;
  digitalStamp: string;
  userName: string;
  userRole: string;
}

const signatureStyles = [
  { id: 'cursive', name: 'Cursive', font: "var(--font-dancing-script)" },
  { id: 'elegant', name: 'Elegant', font: "var(--font-great-vibes)" },
  { id: 'formal', name: 'Formal', font: "var(--font-tangerine)" },
  { id: 'modern', name: 'Modern', font: "var(--font-pacifico)" },
];

export function DigitalSignature({ 
  userName, 
  userRole, 
  onSignatureComplete,
  required = true 
}: DigitalSignatureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [signatureText, setSignatureText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(signatureStyles[0]);
  const [isSigned, setIsSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null);

  useEffect(() => {
    // Auto-fill with user's name
    setSignatureText(userName);
  }, [userName]);

  const generateDigitalStamp = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB');
    const timeStr = now.toLocaleTimeString('en-GB');
    return `${userRole}\n${dateStr} ${timeStr}`;
  };

  const handleSign = () => {
    const data: SignatureData = {
      signatureText,
      signatureStyle: selectedStyle.id,
      timestamp: new Date().toISOString(),
      digitalStamp: generateDigitalStamp(),
      userName,
      userRole,
    };
    setSignatureData(data);
    setIsSigned(true);
    setIsOpen(false);
    onSignatureComplete(data);
  };

  const handleClear = () => {
    setIsSigned(false);
    setSignatureData(null);
    setSignatureText(userName);
  };

  return (
    <div className="space-y-3">
      {!isSigned ? (
        <div>
          {!isOpen ? (
            <Button 
              onClick={() => setIsOpen(true)} 
              variant="outline"
              className="w-full border-2 border-blue-500 hover:bg-blue-50"
            >
              <Pen className="mr-2 h-4 w-4" />
              Click to Sign {required && '*'}
            </Button>
          ) : (
            <Card className="border-2 border-blue-500">
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label>Type your signature</Label>
                  <Input
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label className="mb-2 block">Choose signature style</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {signatureStyles.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setSelectedStyle(style)}
                        className={`p-4 border-2 rounded-md text-center transition-all ${
                          selectedStyle.id === style.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="text-xs text-gray-600 mb-1">{style.name}</p>
                        <p 
                          className="text-2xl"
                          style={{ fontFamily: style.font }}
                        >
                          {signatureText || 'Your Name'}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="mb-2 block">Preview</Label>
                  <div className="bg-white border-2 border-gray-300 rounded-md p-6 min-h-[120px] flex flex-col justify-between">
                    <p 
                      className="text-3xl text-blue-900"
                      style={{ fontFamily: selectedStyle.font }}
                    >
                      {signatureText || 'Your Name'}
                    </p>
                    <div className="text-xs text-gray-600 mt-4 space-y-1">
                      <p className="font-semibold">{userName}</p>
                      <p>{userRole}</p>
                      <p>{new Date().toLocaleDateString('en-GB')} {new Date().toLocaleTimeString('en-GB')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleSign}
                    disabled={!signatureText}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Confirm Signature
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card className="border-2 border-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <p className="text-sm font-semibold text-green-700">
                    Digitally Signed
                  </p>
                </div>
                <div className="bg-white border-2 border-green-300 rounded-md p-4">
                  <p 
                    className="text-2xl text-blue-900 mb-3"
                    style={{ 
                      fontFamily: signatureStyles.find(s => s.id === signatureData?.signatureStyle)?.font 
                    }}
                  >
                    {signatureData?.signatureText}
                  </p>
                  <div className="text-xs text-gray-700 space-y-1 border-t pt-2">
                    <p className="font-semibold">{signatureData?.userName}</p>
                    <p>{signatureData?.userRole}</p>
                    <p>
                      Signed: {signatureData?.timestamp && new Date(signatureData.timestamp).toLocaleString('en-GB')}
                    </p>
                    <p className="text-green-700 font-semibold mt-2">
                      ✓ Digital Signature Valid
                    </p>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Digital Stamp Component (Auto-generated)
interface DigitalStampProps {
  userName: string;
  userRole: string;
  timestamp?: string;
}

export function DigitalStamp({ userName, userRole, timestamp }: DigitalStampProps) {
  const stampTime = timestamp || new Date().toISOString();
  const displayTime = new Date(stampTime).toLocaleString('en-GB');

  return (
    <div className="inline-block">
      <div className="border-4 border-red-600 rounded-md p-3 bg-white transform rotate-[-5deg]">
        <div className="text-center space-y-1">
          <p className="text-xs font-bold text-red-600 uppercase tracking-wider">
            Digitally Signed
          </p>
          <p className="text-sm font-bold text-red-700">
            {userName}
          </p>
          <p className="text-xs text-red-600">
            {userRole}
          </p>
          <p className="text-[10px] text-red-500 border-t border-red-400 pt-1">
            {displayTime}
          </p>
        </div>
      </div>
    </div>
  );
}

// Compact Signature Display (for forms)
interface SignatureDisplayProps {
  signatureData: SignatureData;
}

export function SignatureDisplay({ signatureData }: SignatureDisplayProps) {
  const style = signatureStyles.find(s => s.id === signatureData.signatureStyle);
  
  return (
    <div className="inline-block border-b-2 border-gray-400 min-w-[200px] pb-2">
      <p 
        className="text-xl text-blue-900"
        style={{ fontFamily: style?.font }}
      >
        {signatureData.signatureText}
      </p>
      <p className="text-xs text-gray-600 mt-1">
        {signatureData.userName} ({signatureData.userRole})
      </p>
      <p className="text-[10px] text-gray-500">
        {new Date(signatureData.timestamp).toLocaleString('en-GB')}
      </p>
    </div>
  );
}
