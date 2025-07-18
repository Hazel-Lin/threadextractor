export function HelpSection() {
  return (
    <div className="bg-background py-4 w-full h-full">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-foreground mb-4">
          How to use
        </h2>
        
        <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              1
            </div>
            <h3 className="text-base font-semibold text-foreground">Copy Link</h3>
            <p className="text-sm text-muted-foreground">
              Copy the Threads video post link from the app or website
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              2
            </div>
            <h3 className="text-base font-semibold text-foreground">Paste & Extract</h3>
            <p className="text-sm text-muted-foreground">
              Paste the link into the input box and click Download
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto text-lg font-bold">
              3
            </div>
            <h3 className="text-base font-semibold text-foreground">Save Video</h3>
            <p className="text-sm text-muted-foreground">
              Click download button or copy the link to save the video
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}