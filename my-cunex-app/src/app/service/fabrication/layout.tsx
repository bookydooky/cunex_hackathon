"use client";

const serviceLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  return (
      <div>
        {children}
        <footer className="bg-pink-100 py-4 text-center text-pink-500">
          <p>Questions? Contact us CUNEX call center at Tel: 02-008-6556</p>
        </footer>
      </div>
  );
}
export default serviceLayout;
