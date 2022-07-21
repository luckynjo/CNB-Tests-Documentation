#!/usr/local/bin/perl

use JSON;
use Cwd;
use WebCNP::Config;
use WWW::Auth;
use WWW::Auth::DB;
require 'webcnp_lib.pl';
use Encode;
use strict;
use warnings;
=pod

=head1 DESCRIPTION
This module handles Z Score CRUD. The code herein is for creating, reading, updating and deleting surveys. It functions as both model and controller. All viewing functions will be handled by the views themselves. In a way, the hope is to move towards an MVC architecture.
All other modules will be left as they are unless we are given permission to refactor them as well.

=cut

my ($cgi, $CONFIG, $DEBUG, $template, $datetime, $db, $server_type, $server_name) = &init_webcnp('languages.pl');


my $dbh = $db->{_dbh};

my %vars = (
    CONFIG => $CONFIG,
    server_type => $server_type,
    server_name => $server_name,
    server_url => $CONFIG->{server}->{url},
    script => '/languages.pl'
);

# only returns upon successful authentication
#my ($adminid, $http_header_hashref) = check_login($cgi, \%vars, 'zscores', $template, 'zscores.pl', $db);
my %invalid_request = ("status" => 400, "message" => "There was an error processing your request. Please try again later.");
my %invalid_upload_request = ("status" => 400, "message" => "There was an error uploading the file. Please check your input and try again.");
my %success_request = ("status" => 400, "message" => "Content was updated successfully.");
my $raw_data = $cgi->param('POSTDATA');

if(!$raw_data)
{
  print STDERR "No post data and no file upload, exiting.";
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
  exit;
}

print STDERR "Data be " . $raw_data . "\n";
my $data = decode_json($raw_data);
print STDERR "Data ke " . $data;

my $action = $data->{op};

if($action eq "view")
{
  my $languages = view();
  my %results = (
     "languages" => $languages
  );
  print $cgi->header('application/json');
  print JSON::XS->new->utf8->encode(\%results);
}
elsif($action eq "save")
{
  my $document_id = $data->{id};
  my $language = $data->{language};
  my $transltion_content = $data->{translation};
  print STDERR "translate based on " . $transltion_content . "\n";
  my $timeline = save_translation($document_id, $language, $transltion_content);
  my %results = (
     "success" => "Your data was saved successfully."
  );
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%results);
}
else
{
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\%invalid_request);
}

sub view
{
  my $stmt = "SELECT * FROM languages";
  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }

  #my @variable_bindings = ($test_version_id, $title, $section_number);
  my @variable_bindings = ();
  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  my @languages = ();
  #my $section;
  while(my $language = $query->fetchrow_hashref)
  {
    print STDERR "Found session $language\n";
    push(@languages, $language);
  }
  $query->finish;
  return \@languages;
}

sub save
{
  my $language_code = shift;
  my $language_title = shift;

  # Get all the sections for a given test.
  my $stmt = "INSERT INTO languages(iso_code, title) VALUES(?, ?)";

  print STDERR "Statement be " . $stmt . " with values $language_code, $language_title\n";

  my $query = $dbh->prepare($stmt);
  if($query->errstr())
  {
      print STDERR "DB error during prepare statement ".$query->errstr()."\n";
  }
  my @variable_bindings = ($language_code, $language_title);

  $query->execute(@variable_bindings);
  if($query->errstr())
  {
      print STDERR "DB error during execute statement ".$query->errstr()."\n";
  }
  $query->finish;
}


sub on_error
{
  my $error = shift;
  print $cgi->header('application/json');
  print JSON::XS->new->encode(\$error);
}
1;
