%define _use_internal_dependency_generator 0
%define __find_provides         %{nil}
%define __find_requires         %{nil}


Name:           cloudify-stage
Version:        %{CLOUDIFY_VERSION}
Release:        %{CLOUDIFY_PACKAGE_RELEASE}%{?dist}
Summary:        Cloudify Stage
Group:          Applications/Multimedia
License:        Apache 2.0
URL:            https://github.com/cloudify-cosmo/cloudify-stage
Vendor:         Cloudify Inc.
Packager:       Cloudify Inc.

Requires:       nodejs
BuildRequires:  %{requires}, git

%description
Cloudify's REST Service.


%prep

%build
export NPM_PACKAGES=/opt/npm-packages
export PATH="$NPM_PACKAGES/bin:$PATH"
unset MANPATH
export MANPATH="$NPM_PACKAGES/share/man:$(manpath)"

echo prefix=${NPM_PACKAGES} > ~/.npmrc

mkdir /builddir/.npm

mkdir -p ${NPM_PACKAGES}

cd ${RPM_SOURCE_DIR}

npm install webpack -g
npm install bower -g
npm install gulp -g
npm install grunt-cli -g
npm install
bower install
pushd semantic
        gulp build
popd
pushd backend
        npm install
popd
webpack --config webpack.config-prod.js --bail

%install
install -m 755 -d %{buildroot}/opt/cloudify-stage/{dist, backend, conf}
cp -r ${RPM_SOURCE_DIR}/dist/** %{buildroot}/opt/cloudify-stage/dist
cp -r ${RPM_SOURCE_DIR}/backend/** %{buildroot}/opt/cloudify-stage/backend
cp ${RPM_SOURCE_DIR}/conf/** %{buildroot}/opt/cloudify-stage/conf
cp ${RPM_SOURCE_DIR}/scripts/package-template.json %{buildroot}/opt/cloudify-stage/package.json


%pre
%post
%preun
%postun


%files

/opt/cloudify-stage
