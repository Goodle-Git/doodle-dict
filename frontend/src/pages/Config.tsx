import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import DashboardNavbar from '@/components/layout/DashboardNavbar';
import { useImageGenConfig } from '@/hooks/useImageGenConfig';

const Config = () => {
  const { useGemini, toggleImageGen, stableDiffusionUrl, setStableDiffusionUrl } = useImageGenConfig();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <DashboardNavbar />
      <div className="container mx-auto px-4 py-8 flex-1 pt-24">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 border-2 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-bold mb-6">App Configuration</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Image Generation</h3>
                  <p className="text-sm text-gray-500">
                    Use <strong>Gemini Flash 2.0</strong> instead of Stable Diffusion for image generation.
                  </p>
                </div>
                <Switch
                  checked={useGemini}
                  onCheckedChange={toggleImageGen}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Stable Diffusion API URL</h3>
                <Input
                  type="url"
                  value={stableDiffusionUrl}
                  onChange={(e) => setStableDiffusionUrl(e.target.value)}
                  placeholder="https://8374-34-139-188-243.ngrok-free.app/generate"
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Enter the URL for your Stable Diffusion API endpoint.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Config;