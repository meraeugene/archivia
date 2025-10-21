const UploadGuidelines = () => {
  return (
    <div className="flex justify-center mt-12">
      <div className="bg-white shadow-xs p-8 rounded-lg max-w-4xl w-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Thesis Upload Guidelines
        </h3>

        <div className="flex flex-col md:flex-row justify-between text-sm text-gray-700 gap-6">
          {/* File Requirements */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              File Requirements
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Accepted format: <span className="font-medium">PDF only</span>
              </li>
              <li>
                Maximum file size: <span className="font-medium">5MB</span>
              </li>
              <li>Only one file can be uploaded</li>
            </ul>
          </div>

          {/* Submission Guidelines */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">
              Submission Guidelines
            </h4>
            <ul className="space-y-1 list-disc list-inside">
              <li>
                Ensure the thesis is the{" "}
                <span className="font-medium">final approved version</span>
              </li>
              <li>Include all necessary sections and appendices</li>
              <li>Check formatting and content before uploading</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadGuidelines;
