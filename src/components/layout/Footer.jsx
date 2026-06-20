export default function Footer() {
  return (
    <footer className="footer footer-center p-6 bg-base-100 border-t border-base-300">
      <aside>
        <p>
          © {new Date().getFullYear()} TUG.GG
        </p>
      </aside>
    </footer>
  );
}