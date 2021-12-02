import esbuildServe from 'esbuild-serve';

esbuildServe(
    {
        entryPoints: ['app.jsx'],
        outfile: 'public/app.js',
        bundle: true,
        define: {
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
        }
    },
    {
        // serve options (optional)
        port: 3000,
        root: 'public'
    }
);